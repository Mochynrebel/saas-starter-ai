import { NextRequest, NextResponse } from 'next/server'
import { experimental_generateImage as generateImage } from 'ai'
import { withTokenRefresh } from '@/lib/auth-server'
import { refundCredits, spendCreditsAtomic } from '@/lib/credits'
import { getImageGenerationCreditCost } from '@/lib/ai-cost'
import { getRequestDictionary } from '@/lib/api-i18n'
import { modelProviderMap, ImageSize, ParsedRequestBody, AiRouteError } from '@/lib/ai-models-config'
import { isModelSupportedForMode } from '@/lib/ai-models'
import {
  createGenerationRecord,
  deleteStoredImage,
  uploadGeneratedImageFromBase64,
  uploadSourceImage,
} from '@/lib/ai-generations'

const OPENAI_IMAGE_MODELS = new Set(['gpt-image-2'])
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

function shouldAddCorsHeaders(request: NextRequest) {
  const referer = request.headers.get('referer')
  if (!referer) return false
  return referer.includes('localhost:300') || referer.includes('127.0.0.1:300')
}

function getCorsHeaders(request: NextRequest) {
  const baseHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (shouldAddCorsHeaders(request)) {
    return {
      ...baseHeaders,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  }

  return baseHeaders
}

async function createErrorResponse(error: string, messageKey: string, status = 400, request: NextRequest, params?: Record<string, string>) {
  const dict = await getRequestDictionary(request)
  let message = (dict.ai?.api?.[messageKey as keyof NonNullable<typeof dict.ai.api>] as string) || messageKey
  
  // Replace placeholders like {cost}, {balance}, etc.
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      message = message.replace(`{${key}}`, value)
    })
  }
  
  return NextResponse.json(
    { error, message },
    {
      status,
      headers: getCorsHeaders(request),
    }
  )
}

export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function POST(request: NextRequest) {
  return withTokenRefresh(request, async (user) => {
    let creditsReserved = false
    let reservedCost = 0
    let storedOutputPath: string | null = null
    let storedSourcePath: string | null = null

    try {
      if (!user?.id) {
        return await createErrorResponse('UNAUTHORIZED', 'userAuthenticationRequired', 401, request)
      }

      const { prompt, model, size, mode, sourceImage } = await parseRequestBody(request)
      
      // Log request parameters
      console.log('[AI Generate] Request params:', {
        model,
        size,
        mode,
        promptLength: prompt?.length || 0,
        hasSourceImage: !!sourceImage,
      })
      
      const modelConfig = await resolveModelConfig(model, request)
      const creditCost = getImageGenerationCreditCost({ model, size, mode })
      const creditReservation = await spendCreditsAtomic(user.id, creditCost, 'AI image generation')

      if (creditReservation.error) {
        throw new AiRouteError('CREDITS_SYSTEM_ERROR', 'creditsSpendFailed', 500)
      }

      if (!creditReservation.success) {
        throw new AiRouteError(
          'INSUFFICIENT_CREDITS',
          'notEnoughCredits',
          402,
          { cost: creditCost.toString(), balance: creditReservation.balance.toString() }
        )
      }

      creditsReserved = true
      reservedCost = creditCost

      const startTime = Date.now()
      const startTimeISO = new Date().toISOString()
      console.log('[AI Generate] Start time:', startTimeISO)

      const imageBase64 = mode === 'image-to-image'
        ? await generateImageEditWithOpenAI(model, prompt, size, sourceImage, request)
        : await generateImageFromPrompt(modelConfig, model, prompt, size, request)
      
      const endTime = Date.now()
      const endTimeISO = new Date().toISOString()
      const duration = endTime - startTime
      console.log('[AI Generate] End time:', endTimeISO)
      console.log('[AI Generate] Duration:', `${duration}ms (${(duration / 1000).toFixed(2)}s)`)

      if (sourceImage) {
        const sourceAsset = await uploadSourceImage(user.id, sourceImage)
        storedSourcePath = sourceAsset.path
      }

      const outputAsset = await uploadGeneratedImageFromBase64(user.id, imageBase64, 'image/png')
      storedOutputPath = outputAsset.path

      const generationRecord = await createGenerationRecord({
        userId: user.id,
        prompt,
        model,
        mode,
        size,
        creditCost,
        outputImagePath: outputAsset.path,
        outputMimeType: outputAsset.mimeType,
        sourceImagePath: storedSourcePath,
        metadata: {
          durationMs: duration,
          provider: OPENAI_IMAGE_MODELS.has(model) ? 'openai' : modelConfig.envName.toLowerCase(),
        },
      })

      return await finalizeGeneration(
        outputAsset.signedUrl,
        imageBase64,
        generationRecord.id,
        creditReservation.balance,
        creditCost,
        request
      )
    } catch (error) {
      if (creditsReserved && reservedCost > 0) {
        await refundCredits(user.id, reservedCost, 'Refund for failed AI image generation')
      }

      if (storedOutputPath) {
        await deleteStoredImage(storedOutputPath)
      }

      if (storedSourcePath) {
        await deleteStoredImage(storedSourcePath)
      }

      if (error instanceof AiRouteError) {
        return await createErrorResponse(error.code, error.messageKey, error.status, request, error.params)
      }

      // For external provider errors, return the original error message as-is
      // Don't try to localize AI model provider errors since they can be in any language
      const detailMessage = buildExternalProviderErrorMessage(error)
      
      return NextResponse.json(
        { error: 'GENERATION_FAILED', message: detailMessage },
        {
          status: 500,
          headers: getCorsHeaders(request),
        }
      )
    }
  })
}

async function parseRequestBody(request: NextRequest): Promise<ParsedRequestBody> {
  const contentType = request.headers.get('content-type') || ''
  const isMultipart = contentType.includes('multipart/form-data')

  let prompt: unknown
  let model: unknown
  let size: unknown
  let mode: unknown
  let sourceImage: File | undefined

  if (isMultipart) {
    const formData = await request.formData()
    prompt = formData.get('prompt')
    model = formData.get('model')
    size = formData.get('size')
    mode = formData.get('mode')
    const imageCandidate = formData.get('sourceImage')
    if (imageCandidate instanceof File && imageCandidate.size > 0) {
      sourceImage = imageCandidate
    }
  } else {
    let body: any
    try {
      body = await request.json()
    } catch {
      throw new AiRouteError('INVALID_BODY', 'invalidJsonBody', 400)
    }
    prompt = body?.prompt
    model = body?.model
    size = body?.size
    mode = body?.mode
  }

  if (!prompt || typeof prompt !== 'string') {
    throw new AiRouteError('PROMPT_REQUIRED', 'promptRequired', 400)
  }

  if (!model || typeof model !== 'string') {
    throw new AiRouteError('MODEL_REQUIRED', 'modelRequired', 400)
  }

  if (size && !isValidSize(size)) {
    throw new AiRouteError('INVALID_SIZE', 'unsupportedSize', 400, { size: String(size) })
  }

  if (mode !== 'text-to-image' && mode !== 'image-to-image') {
    throw new AiRouteError('INVALID_MODE', 'invalidGenerationMode', 400)
  }

  if (!isModelSupportedForMode(model, mode)) {
    throw new AiRouteError('UNSUPPORTED_MODE_MODEL', 'imageToImageModelUnsupported', 400, { model })
  }

  if (mode === 'image-to-image') {
    if (!sourceImage) {
      throw new AiRouteError('REFERENCE_IMAGE_REQUIRED', 'referenceImageRequired', 400)
    }

    validateSourceImage(sourceImage)
  }

  return {
    prompt,
    model,
    mode,
    size: size as ImageSize | undefined,
    sourceImage,
  }
}

async function resolveModelConfig(model: string, request: NextRequest) {
  const config = modelProviderMap[model as keyof typeof modelProviderMap]
  if (!config) {
    const availableModels = Object.keys(modelProviderMap).join(', ')
    throw new AiRouteError(
      'UNSUPPORTED_MODEL',
      'unsupportedModel',
      400,
      { model, models: availableModels }
    )
  }
  return config
}

async function buildImageModel(modelConfig: (typeof modelProviderMap)[keyof typeof modelProviderMap], model: string, request: NextRequest) {
  const apiKey = process.env[modelConfig.envKey]

  if (!apiKey) {
    throw new AiRouteError('API_KEY_NOT_CONFIGURED', 'apiKeyNotConfigured', 500, { provider: modelConfig.envName })
  }

  const provider = modelConfig.provider({
    apiKey,
  })

  return (provider as any).image(model)
}

async function generateImageFromPrompt(
  modelConfig: (typeof modelProviderMap)[keyof typeof modelProviderMap],
  model: string,
  prompt: string,
  size: ImageSize | undefined,
  request: NextRequest
) {
  if (OPENAI_IMAGE_MODELS.has(model)) {
    return generateImageWithOpenAI(model, prompt, size, request)
  }

  const imageModel = await buildImageModel(modelConfig, model, request)
  const generateOptions = buildGenerationOptions(imageModel, prompt, size)

  console.log('[AI Generate] SDK options:', {
    model,
    size: generateOptions.size,
    hasSize: !!generateOptions.size,
    optionsKeys: Object.keys(generateOptions)
  })

  const imageResult = await generateImage(generateOptions)
  return imageResult.image.base64
}

function buildGenerationOptions(imageModel: any, prompt: string, size?: ImageSize) {
  const options: any = {
    model: imageModel,
    prompt,
  }

  if (size) {
    options.size = size
  }

  return options
}

async function generateImageWithOpenAI(
  model: string,
  prompt: string,
  size: ImageSize | undefined,
  request: NextRequest
) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new AiRouteError('API_KEY_NOT_CONFIGURED', 'apiKeyNotConfigured', 500, { provider: 'OpenAI' })
  }

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      prompt,
      size: size || '1024x1024',
      output_format: 'png',
    }),
  })

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(data?.error?.message || data?.message || 'Failed to generate image')
  }

  const base64 = data?.data?.[0]?.b64_json
  if (!base64) {
    throw new Error('OpenAI did not return image data.')
  }

  return base64 as string
}

async function generateImageEditWithOpenAI(
  model: string,
  prompt: string,
  size: ImageSize | undefined,
  sourceImage: File | undefined,
  request: NextRequest
) {
  if (!sourceImage) {
    throw new AiRouteError('REFERENCE_IMAGE_REQUIRED', 'referenceImageRequired', 400)
  }

  if (!OPENAI_IMAGE_MODELS.has(model)) {
    throw new AiRouteError('UNSUPPORTED_MODE_MODEL', 'imageToImageModelUnsupported', 400, { model })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new AiRouteError('API_KEY_NOT_CONFIGURED', 'apiKeyNotConfigured', 500, { provider: 'OpenAI' })
  }

  const formData = new FormData()
  formData.append('model', model)
  formData.append('prompt', prompt)
  formData.append('size', size || '1024x1024')
  formData.append('output_format', 'png')
  formData.append('image', sourceImage, sourceImage.name || 'reference.png')

  const response = await fetch('https://api.openai.com/v1/images/edits', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  })

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(data?.error?.message || data?.message || 'Failed to edit image')
  }

  const base64 = data?.data?.[0]?.b64_json
  if (!base64) {
    throw new Error('OpenAI did not return edited image data.')
  }

  return base64 as string
}

async function finalizeGeneration(
  imageUrl: string,
  imageBase64: string,
  generationId: string,
  remainingBalance: number,
  cost: number,
  request: NextRequest
) {
  return NextResponse.json(
    {
      generationId,
      imageUrl,
      images: [
        {
          url: imageUrl,
          base64: imageBase64,
        },
      ],
      credits: {
        cost,
        balance: Math.max(remainingBalance, 0),
      },
    },
    {
      headers: getCorsHeaders(request),
    }
  )
}

function isValidSize(size: any): size is ImageSize {
  return ['256x256', '512x512', '768x768', '1024x1024', '1024x1792', '1792x1024'].includes(size)
}

function validateSourceImage(file: File) {
  if (!file.type.startsWith('image/')) {
    throw new AiRouteError('INVALID_REFERENCE_IMAGE', 'invalidReferenceImage', 400)
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new AiRouteError('REFERENCE_IMAGE_TOO_LARGE', 'referenceImageTooLarge', 400, {
      size: `${Math.round(MAX_UPLOAD_BYTES / (1024 * 1024))}MB`,
    })
  }
}

function buildExternalProviderErrorMessage(error: any) {
  let errorMessage = 'Failed to generate image'

  if (error?.data?.error?.message) {
    errorMessage = error.data.error.message
  } else if (error?.data?.message) {
    errorMessage = error.data.message
  } else if (error?.error?.message) {
    errorMessage = error.error.message
  } else if (error?.message) {
    errorMessage = error.message
  } else if (error?.response?.data?.error?.message) {
    errorMessage = error.response.data.error.message
  } else if (error?.response?.data?.error) {
    errorMessage =
      typeof error.response.data.error === 'string'
        ? error.response.data.error
        : JSON.stringify(error.response.data.error)
  } else if (typeof error === 'string') {
    errorMessage = error
  }

  return `${errorMessage}${error?.cause ? ` (Cause: ${error.cause})` : ''}`
}



import { createSupabaseAdminClient } from './supabase'
import { GenerationMode } from './ai-models'

const DEFAULT_GENERATIONS_BUCKET = process.env.SUPABASE_GENERATIONS_BUCKET?.trim() || 'ai-generated-images'
const DEFAULT_SIGNED_URL_TTL = Number(process.env.SUPABASE_GENERATIONS_SIGNED_URL_TTL ?? '604800') || 604800

export interface CreateGenerationRecordInput {
  userId: string
  prompt: string
  model: string
  mode: GenerationMode
  size?: string
  creditCost: number
  outputImagePath: string
  outputMimeType?: string
  sourceImagePath?: string | null
  metadata?: Record<string, unknown>
}

function getBucketName() {
  return DEFAULT_GENERATIONS_BUCKET
}

function getSignedUrlTtl() {
  return DEFAULT_SIGNED_URL_TTL
}

function getFileExtension(mimeType: string) {
  if (mimeType === 'image/jpeg') return 'jpg'
  if (mimeType === 'image/webp') return 'webp'
  return 'png'
}

function buildStoragePath(userId: string, mimeType: string) {
  const date = new Date()
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const extension = getFileExtension(mimeType)
  return `${userId}/${year}/${month}/${crypto.randomUUID()}.${extension}`
}

export async function uploadGeneratedImageFromBase64(
  userId: string,
  imageBase64: string,
  mimeType: string = 'image/png'
) {
  const supabase = createSupabaseAdminClient()
  const bucket = getBucketName()
  const storagePath = buildStoragePath(userId, mimeType)
  const buffer = Buffer.from(imageBase64, 'base64')

  const { error } = await supabase.storage
    .from(bucket)
    .upload(storagePath, buffer, {
      contentType: mimeType,
      upsert: false,
      cacheControl: '3600',
    })

  if (error) {
    throw new Error(`Failed to upload generated image: ${error.message}`)
  }

  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from(bucket)
    .createSignedUrl(storagePath, getSignedUrlTtl())

  if (signedUrlError || !signedUrlData?.signedUrl) {
    throw new Error(signedUrlError?.message || 'Failed to create signed URL for generated image')
  }

  return {
    bucket,
    path: storagePath,
    signedUrl: signedUrlData.signedUrl,
    mimeType,
  }
}

export async function uploadSourceImage(userId: string, file: File) {
  const arrayBuffer = await file.arrayBuffer()
  const mimeType = file.type || 'image/png'
  const storagePath = buildStoragePath(userId, mimeType)
  const supabase = createSupabaseAdminClient()

  const { error } = await supabase.storage
    .from(getBucketName())
    .upload(storagePath, Buffer.from(arrayBuffer), {
      contentType: mimeType,
      upsert: false,
      cacheControl: '3600',
    })

  if (error) {
    throw new Error(`Failed to upload source image: ${error.message}`)
  }

  return {
    path: storagePath,
    mimeType,
  }
}

export async function deleteStoredImage(path: string) {
  const supabase = createSupabaseAdminClient()
  const { error } = await supabase.storage
    .from(getBucketName())
    .remove([path])

  if (error) {
    console.error('Failed to delete stored image:', error)
  }
}

export async function createGenerationRecord(input: CreateGenerationRecordInput) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from('ai_generations')
    .insert({
      user_id: input.userId,
      prompt: input.prompt,
      model: input.model,
      mode: input.mode,
      size: input.size || null,
      credit_cost: input.creditCost,
      output_image_path: input.outputImagePath,
      output_mime_type: input.outputMimeType || 'image/png',
      source_image_path: input.sourceImagePath || null,
      metadata: input.metadata || {},
    })
    .select('*')
    .single()

  if (error) {
    throw new Error(`Failed to create generation record: ${error.message}`)
  }

  return data
}

export async function listUserGenerationHistory(userId: string, limit: number = 20) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from('ai_generations')
    .select('id, created_at, prompt, model, mode, size, credit_cost, output_image_path')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(`Failed to fetch generation history: ${error.message}`)
  }

  const generations = await Promise.all(
    (data || []).map(async (item) => {
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from(getBucketName())
        .createSignedUrl(item.output_image_path, getSignedUrlTtl())

      if (signedUrlError || !signedUrlData?.signedUrl) {
        throw new Error(signedUrlError?.message || 'Failed to create signed URL for history image')
      }

      return {
        id: item.id,
        createdAt: item.created_at,
        prompt: item.prompt,
        model: item.model,
        mode: item.mode,
        size: item.size,
        creditCost: item.credit_cost,
        imageUrl: signedUrlData.signedUrl,
      }
    })
  )

  return generations
}

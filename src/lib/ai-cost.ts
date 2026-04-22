import { GenerationMode } from './ai-models'

interface ImageGenerationCostInput {
  model?: string
  size?: string
  mode?: GenerationMode
}

function sanitizeCostToken(value?: string) {
  if (!value) return undefined

  return value
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toUpperCase()
}

function readNumericEnv(name: string) {
  const rawValue = process.env[name] ?? process.env[`NEXT_PUBLIC_${name}`]
  const parsedValue = Number(rawValue)
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : undefined
}

export function getImageGenerationCreditCost(input: ImageGenerationCostInput = {}): number {
  const modelToken = sanitizeCostToken(input.model)
  const sizeToken = sanitizeCostToken(input.size)
  const modeToken = sanitizeCostToken(input.mode)

  const candidateEnvNames = [
    modelToken && sizeToken && modeToken ? `AI_IMAGE_CREDIT_COST_${modelToken}_${sizeToken}_${modeToken}` : undefined,
    modelToken && sizeToken ? `AI_IMAGE_CREDIT_COST_${modelToken}_${sizeToken}` : undefined,
    modelToken && modeToken ? `AI_IMAGE_CREDIT_COST_${modelToken}_${modeToken}` : undefined,
    modelToken ? `AI_IMAGE_CREDIT_COST_${modelToken}` : undefined,
    modeToken ? `AI_IMAGE_CREDIT_COST_${modeToken}` : undefined,
    'AI_IMAGE_CREDIT_COST',
  ].filter(Boolean) as string[]

  for (const envName of candidateEnvNames) {
    const configuredValue = readNumericEnv(envName)
    if (configuredValue !== undefined) {
      return configuredValue
    }
  }

  return 1
}



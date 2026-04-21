import { Locale } from '@/lib/i18n'
import { AIImageGenerator } from './ai-image-generator'
import { getAiWorkspaceContent } from './ai-content'

interface AILandingPageContentProps {
  locale: Locale
  aiConfig: any
}

export function AILandingPageContent({
  locale,
  aiConfig,
}: AILandingPageContentProps) {
  const workspace = getAiWorkspaceContent(locale)

  const generatorConfig = {
    ...aiConfig.generator,
    checkingCredits: aiConfig.generator.checkingCredits,
    credits: aiConfig.generator.credits,
    cost: aiConfig.generator.cost,
    creditsUnavailable: aiConfig.generator.creditsUnavailable,
    notEnoughCredits: aiConfig.generator.notEnoughCredits,
    pleaseSignIn: aiConfig.generator.pleaseSignIn,
    unableToFetchCredits: aiConfig.generator.unableToFetchCredits,
    unableToFetchCost: aiConfig.generator.unableToFetchCost,
    failedToFetchCost: aiConfig.generator.failedToFetchCost,
    imageGenerationTimeout: aiConfig.generator.imageGenerationTimeout,
    modelNotConfigured: aiConfig.generator.modelNotConfigured,
  }

  return (
    <section className="px-4 pb-10 pt-20 sm:px-6 lg:px-8 lg:pb-14 lg:pt-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/75">
            Create
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-4xl lg:text-5xl">
            {workspace.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            {workspace.description}
          </p>
        </div>

        <AIImageGenerator config={generatorConfig} />
      </div>
    </section>
  )
}

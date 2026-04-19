import { Locale } from '@/lib/i18n'
import { AIImageGenerator } from './ai-image-generator'
import { FeatureShowcase } from './feature-showcase'
import { FAQ } from '@/components/sections/faq'
import { getAiExampleImages, getAiFaqContent, getAiShowcaseContent } from './ai-content'

interface AILandingPageContentProps {
  locale: Locale
  aiConfig: any
}

export function AILandingPageContent({
  locale,
  aiConfig,
}: AILandingPageContentProps) {
  const showcase = getAiShowcaseContent(locale)
  const faq = getAiFaqContent(locale)

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
    exampleImages: getAiExampleImages(locale),
  }

  return (
    <>
      <section className="px-4 pb-10 pt-12 sm:px-6 lg:px-8 lg:pb-14 lg:pt-16">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-8 max-w-4xl text-center lg:mb-10">
            <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl lg:text-6xl">
              {showcase.title}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              {showcase.description}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {showcase.stats.map((stat) => (
                <span
                  key={stat}
                  className="rounded-full border border-border/70 bg-muted/30 px-4 py-2 text-sm text-foreground/85"
                >
                  {stat}
                </span>
              ))}
            </div>
          </div>

          <AIImageGenerator config={generatorConfig} />
        </div>
      </section>

      <FeatureShowcase
        badge={showcase.sectionBadge}
        title={showcase.sectionTitle}
        description={showcase.sectionDescription}
        items={showcase.items}
      />

      <FAQ dict={faq} />
    </>
  )
}

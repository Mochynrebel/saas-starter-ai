import React from 'react'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { AuthProvider } from '@/contexts/AuthContext'
import { Layout } from '@/components/layout/layout'
import { SectionLayout } from '@/components/layout/section-layout'
import { getDictionary } from '@/lib/dictionaries'
import { defaultLocale } from '@/lib/i18n'
import { generateMetadata as generateI18nMetadata } from '@/lib/metadata'
import { getServerUser } from '@/lib/auth-server'
import { AIImageGenerator } from './[lang]/ai/ai-image-generator'

export const dynamic = 'force-static'

export async function generateMetadata() {
  return generateI18nMetadata(defaultLocale)
}

export default async function RootPage() {
  const dict = await getDictionary(defaultLocale)
  const aiConfig = dict.ai
  const { user } = await getServerUser()

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
    exampleImages: [
      {
        imageUrl: '/images/ai-examples/tweet-sample-01.jpg',
        alt: 'Restaurant portrait sample',
        prompt:
          'Close-up fashion portrait in front of a wine wall, warm ambient lighting, wavy blonde hair, natural skin detail, wine glass in the foreground, lifestyle photography',
      },
      {
        imageUrl: '/images/ai-examples/tweet-sample-02.jpg',
        alt: 'Game skin sample',
        prompt:
          'First-person shooter weapon showcase, AK-47 with a red-and-blue Spider-Man themed skin, urban street background, in-game UI overlay, high-detail render',
      },
      {
        imageUrl: '/images/ai-examples/tweet-sample-03.jpg',
        alt: 'Night street fashion sample',
        prompt:
          'Night street fashion photo in front of a neon liquor store sign, black feather coat and sunglasses, frozen splash of milk and colorful cereal loops, flash photography',
      },
    ],
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider initialUser={user}>
        <Layout dict={dict} initialUser={user}>
          <div className="pt-8">
            <SectionLayout
              className="px-4"
              padding="small"
              title={aiConfig.generator.title}
              description={aiConfig.generator.description}
              titleClassName="text-3xl md:text-4xl"
              descriptionClassName="max-w-3xl"
              headerClassName="mb-16"
              locale={defaultLocale}
            >
              <AIImageGenerator config={generatorConfig} />
            </SectionLayout>
          </div>
        </Layout>
      </AuthProvider>
    </ThemeProvider>
  )
}

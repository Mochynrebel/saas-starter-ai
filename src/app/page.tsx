import React from 'react'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { AuthProvider } from '@/contexts/AuthContext'
import { Layout } from '@/components/layout/layout'
import { getDictionary } from '@/lib/dictionaries'
import { defaultLocale } from '@/lib/i18n'
import { generateMetadata as generateI18nMetadata } from '@/lib/metadata'
import { getServerUser } from '@/lib/auth-server'
import { getAiExampleImages, getAiFaqContent, getAiShowcaseContent, getHomeHeroContent } from './[lang]/ai/ai-content'
import { HomeImageWorkbench } from './[lang]/home-image-workbench'
import { withCanonical } from '@/lib/seo'
import { FeatureShowcase } from './[lang]/ai/feature-showcase'
import { FAQ } from '@/components/sections/faq'

export const dynamic = 'force-static'

export async function generateMetadata() {
  return withCanonical(await generateI18nMetadata(defaultLocale), defaultLocale)
}

export default async function RootPage() {
  const dict = await getDictionary(defaultLocale)
  const { user } = await getServerUser()
  const homeHero = getHomeHeroContent(defaultLocale)
  const examples = getAiExampleImages(defaultLocale)
  const showcase = getAiShowcaseContent(defaultLocale)
  const faq = getAiFaqContent(defaultLocale)

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider initialUser={user}>
        <Layout dict={dict} initialUser={user}>
          <>
            <HomeImageWorkbench
              locale={defaultLocale}
              title={homeHero.title}
              description={homeHero.description}
              examples={examples}
            />
            <FeatureShowcase
              badge={showcase.sectionBadge}
              title={showcase.sectionTitle}
              description={showcase.sectionDescription}
              items={showcase.items}
            />
            <FAQ dict={faq} />
          </>
        </Layout>
      </AuthProvider>
    </ThemeProvider>
  )
}

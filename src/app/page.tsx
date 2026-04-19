import React from 'react'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { AuthProvider } from '@/contexts/AuthContext'
import { Layout } from '@/components/layout/layout'
import { getDictionary } from '@/lib/dictionaries'
import { defaultLocale } from '@/lib/i18n'
import { generateMetadata as generateI18nMetadata } from '@/lib/metadata'
import { getServerUser } from '@/lib/auth-server'
import { AILandingPageContent } from './[lang]/ai/ai-landing-page-content'
import { withCanonical } from '@/lib/seo'

export const dynamic = 'force-static'

export async function generateMetadata() {
  return withCanonical(await generateI18nMetadata(defaultLocale), defaultLocale)
}

export default async function RootPage() {
  const dict = await getDictionary(defaultLocale)
  const { user } = await getServerUser()

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider initialUser={user}>
        <Layout dict={dict} initialUser={user}>
          <AILandingPageContent locale={defaultLocale} aiConfig={dict.ai} />
        </Layout>
      </AuthProvider>
    </ThemeProvider>
  )
}

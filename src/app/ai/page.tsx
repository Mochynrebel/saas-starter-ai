import React from 'react'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { AuthProvider } from '@/contexts/AuthContext'
import { Layout } from '@/components/layout/layout'
import { getDictionary } from '@/lib/dictionaries'
import { defaultLocale } from '@/lib/i18n'
import { getServerUser } from '@/lib/auth-server'
import { withCanonical } from '@/lib/seo'
import { AILandingPageContent } from '../[lang]/ai/ai-landing-page-content'
import { getAiWorkspaceContent } from '../[lang]/ai/ai-content'

export const dynamic = 'force-static'

export async function generateMetadata() {
  const workspace = getAiWorkspaceContent(defaultLocale)
  return withCanonical(
    {
      title: workspace.title,
      description: workspace.description,
      openGraph: {
        title: workspace.title,
        description: workspace.description,
      },
      twitter: {
        title: workspace.title,
        description: workspace.description,
      },
    },
    defaultLocale,
    '/ai'
  )
}

export default async function DefaultLocaleAIPage() {
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

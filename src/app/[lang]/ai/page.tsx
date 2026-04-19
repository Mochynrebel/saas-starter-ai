import React from 'react'
import { Layout } from '@/components/layout/layout'
import { getDictionary } from '@/lib/dictionaries'
import { Locale, locales } from '@/lib/i18n'
import { AILandingPageContent } from './ai-landing-page-content'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return locales.map((locale) => ({
    lang: locale
  }))
}

export default async function AIPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <Layout dict={dict}>
      <AILandingPageContent locale={lang} aiConfig={dict.ai} />
    </Layout>
  )
}

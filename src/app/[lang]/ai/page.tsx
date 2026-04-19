import React from 'react'
import { Layout } from '@/components/layout/layout'
import { getDictionary } from '@/lib/dictionaries'
import { Locale, locales } from '@/lib/i18n'
import { withCanonical } from '@/lib/seo'
import { AILandingPageContent } from './ai-landing-page-content'
import { JsonLd } from '@/components/seo/json-ld'
import { buildFaqStructuredData, buildWebsiteStructuredData } from '@/lib/structured-data'
import { getAiFaqContent } from './ai-content'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return locales.map((locale) => ({
    lang: locale
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  return withCanonical({}, lang)
}

export default async function AIPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const faq = getAiFaqContent(lang)
  const websiteStructuredData = buildWebsiteStructuredData(lang)
  const faqStructuredData = buildFaqStructuredData(lang, faq.faq.faqs)

  return (
    <Layout dict={dict}>
      <JsonLd data={websiteStructuredData} />
      <JsonLd data={faqStructuredData} />
      <AILandingPageContent locale={lang} aiConfig={dict.ai} />
    </Layout>
  )
}

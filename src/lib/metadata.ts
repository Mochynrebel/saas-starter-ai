import type { Metadata } from 'next'
import { getDictionary } from './dictionaries'
import { Locale } from './i18n'
import { buildCanonicalUrl, buildLanguageAlternates, siteUrl } from './seo'

export async function generateMetadata(locale: Locale): Promise<Metadata> {
  const dict = await getDictionary(locale)
  const siteName = 'Use GPT Image 2'
  const defaultTitle = 'Use GPT Image 2 | Chat GPT Images Generator | Realistic AI'
  const description =
    'Create high-quality Chat GPT images using our realistic AI generator. Use GPT Image 2 supports image prompts, editing, and fast generation. Try the best Chat GPT Images Generator online.'
  const keywords = [
    'AI image generation',
    'chat gpt images',
    'chat gpt for images',
    'chat gpt prompts cool images',
    'chat gpt image editor',
    'gpt image 2',
    'gpt-image-2',
    'gpt 2 image generation',
    'gpt image 2 release date',
    'gpt-2 image generation',
    'gpt-image-2 release date',
    'gpt-2 image',
  ]
  
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: defaultTitle,
      template: `%s | ${siteName}`
    },
    description,
    keywords,
    authors: [{ name: siteName }],
    creator: siteName,
    openGraph: {
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      url: buildCanonicalUrl(locale),
      title: defaultTitle,
      description,
      siteName,
    },
    alternates: {
      canonical: buildCanonicalUrl(locale),
      languages: buildLanguageAlternates(),
    },
    twitter: {
      card: 'summary_large_image',
      title: defaultTitle,
      description,
      creator: dict.metadata.twitterCreator,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
} 

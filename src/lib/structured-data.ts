import type { Locale } from '@/lib/i18n'
import type { BlogPost } from '@/types/blog'
import { buildCanonicalUrl, siteUrl } from './seo'

const siteName = 'Use GPT Image 2'
const organizationLogo = `${siteUrl}/logo.svg`

function getLanguageTag(locale: Locale) {
  return locale === 'zh' ? 'zh-CN' : 'en-US'
}

function toAbsoluteUrl(path: string) {
  if (!path) return undefined
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}

export function buildWebsiteStructuredData(locale: Locale) {
  const url = buildCanonicalUrl(locale)

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url,
    inLanguage: getLanguageTag(locale),
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: organizationLogo,
      },
    },
  }
}

export function buildFaqStructuredData(
  locale: Locale,
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    url: buildCanonicalUrl(locale),
    inLanguage: getLanguageTag(locale),
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function buildArticleStructuredData(locale: Locale, post: BlogPost) {
  const articleUrl = buildCanonicalUrl(locale, `/blog/${post.slug}`)
  const imageUrl = post.image ? toAbsoluteUrl(post.image) : undefined

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    url: articleUrl,
    mainEntityOfPage: articleUrl,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author || siteName,
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: organizationLogo,
      },
    },
    inLanguage: getLanguageTag(locale),
    image: imageUrl ? [imageUrl] : undefined,
    keywords: post.tags.length > 0 ? post.tags.join(', ') : undefined,
  }
}

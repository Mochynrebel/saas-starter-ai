import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'
import { buildCanonicalUrl } from '@/lib/seo'
import type { Locale } from '@/lib/i18n'

const locales: Locale[] = ['en', 'zh']
const publicRoutes = ['', '/blog', '/features', '/pricing']

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = publicRoutes.flatMap((route) =>
    locales.map((locale) => ({
      url: buildCanonicalUrl(locale, route),
      lastModified: new Date(),
      changeFrequency: route === '' ? ('daily' as const) : ('weekly' as const),
      priority: route === '' ? 1 : 0.8,
    }))
  )

  const blogPosts: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    getAllPosts(locale).map((post) => ({
      url: buildCanonicalUrl(locale, `/blog/${post.slug}`),
      lastModified: new Date(post.date || Date.now()),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  )

  return [...routes, ...blogPosts]
}

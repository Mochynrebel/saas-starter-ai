import type { Metadata } from 'next'
import { defaultLocale, locales, type Locale } from './i18n'

export const siteUrl = 'https://www.usegptimage2.com'

function normalizePath(path: string) {
  if (!path || path === '/') return '/'
  return path.startsWith('/') ? path : `/${path}`
}

export function getLocalizedPath(locale: Locale, path: string = '') {
  const normalized = normalizePath(path)
  if (normalized === '/' || normalized === '/ai') {
    return locale === defaultLocale ? '/' : `/${locale}/ai`
  }
  return `/${locale}${normalized}`
}

export function buildCanonicalUrl(locale: Locale, path: string = '') {
  return `${siteUrl}${getLocalizedPath(locale, path)}`
}

export function buildLanguageAlternates(path: string = '') {
  return Object.fromEntries(
    locales.map((locale) => [locale, buildCanonicalUrl(locale, path)])
  ) as Record<Locale, string>
}

export function withCanonical(
  metadata: Metadata,
  locale: Locale,
  path: string = ''
): Metadata {
  return {
    ...metadata,
    alternates: {
      canonical: buildCanonicalUrl(locale, path),
      languages: buildLanguageAlternates(path),
    },
  }
}

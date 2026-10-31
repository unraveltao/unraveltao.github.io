import type { MetaDescriptor } from 'react-router'
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE_TAGLINE, SITE_URL } from './site'

/** 与原来 BaseLayout 的 Props 一一对应：页面只需要给 title / description / path */
export type PageMetaInput = {
  path: string
  title?: string
  description?: string
  ogType?: 'website' | 'article'
  publishedTime?: string
  image?: string
}

export function pageTitle(title?: string): string {
  return title ? `${title} · ${SITE_NAME}` : `${SITE_NAME} — ${SITE_TITLE_TAGLINE}`
}

export function canonical(path: string): string {
  return new URL(path, SITE_URL).href
}

export function pageMeta({
  path,
  title,
  description = SITE_DESCRIPTION,
  ogType = 'website',
  publishedTime,
  image = '/og.png',
}: PageMetaInput): MetaDescriptor[] {
  const fullTitle = pageTitle(title)
  const imageUrl = new URL(image, SITE_URL).href

  return [
    { title: fullTitle },
    { name: 'description', content: description },
    { property: 'og:type', content: ogType },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:url', content: canonical(path) },
    { property: 'og:image', content: imageUrl },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: fullTitle },
    ...(publishedTime ? [{ property: 'article:published_time', content: publishedTime }] : []),
    { name: 'twitter:image', content: imageUrl },
    // canonical 走 meta 而不是 links：React Router 在预渲染时调用 links() 不带参数，
    // 拿不到 params，动态路由的 canonical 会退化成错误的地址。
    { tagName: 'link', rel: 'canonical', href: canonical(path) },
  ]
}

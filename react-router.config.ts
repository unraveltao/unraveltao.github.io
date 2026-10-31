import { readFileSync } from 'node:fs'
import type { Config } from '@react-router/dev/config'
import { isPublished, type Publishable } from './app/lib/publish'

/**
 * 预渲染清单在构建期算出来，必须和页面用的是同一套发布判定（app/lib/publish.ts）。
 * 路径一律不带尾斜杠：React Router 的产物是 X.html，由 scripts/postbuild.mjs
 * 改写成 X/index.html，才对得上 GitHub Pages 的目录式托管。
 */

type ContentItem = Publishable & { slug: string; tags: string[]; series?: string }

function readCollection(name: string): ContentItem[] {
  const file = new URL(`./.velite/${name}.json`, import.meta.url)
  return JSON.parse(readFileSync(file, 'utf8')) as ContentItem[]
}

const now = new Date()
const posts = readCollection('posts').filter((post) => isPublished(post, now))
const projects = readCollection('projects').filter((project) => !project.draft)

const tags = [...new Set(posts.flatMap((post) => post.tags))]
const series = [...new Set(posts.flatMap((post) => (post.series ? [post.series] : [])))]

export default {
  ssr: true,
  // 默认是 lazy：客户端导航时去 GET /__manifest 补路由表——静态托管上没有这个端点，
  // 结果是每次站内跳转都 404 并掉进 ErrorBoundary。initial 把路由表直接写进 HTML。
  routeDiscovery: { mode: 'initial' },
  prerender: [
    '/',
    '/posts',
    '/projects',
    '/tags',
    '/about',
    '/404',
    ...posts.map((post) => `/posts/${post.slug}`),
    ...projects.map((project) => `/projects/${project.slug}`),
    ...tags.map((tag) => `/tags/${tag}`),
    ...series.map((key) => `/series/${key}`),
  ],
} satisfies Config

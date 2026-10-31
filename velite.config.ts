import { defineCollection, defineConfig, s, type MarkdownOptions } from 'velite'
import rehypeShiki from '@shikijs/rehype'
import rehypeSlug from 'rehype-slug'
import rehypeCodeWindow from './app/lib/rehype-code-window.mjs'

/**
 * 内容层的唯一真源：schema 只在这里定义，页面与文档都不复制字段列表。
 * 这是 ADR-0011 对 Astro Content Collections 的等价替换——strict 让校验失败直接终止构建。
 */

const kebab = s
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, '必须是 kebab-case（小写字母、数字、连字符）')

// shiki 先跑（产出带 token 的 <pre>），code-window 再把它包进 macOS 窗口
// 写成元组字面量而不是先声明变量：Pluggable 是 [plugin, options] 的元组类型，
// 声明成数组会退化成联合类型数组，过不了类型检查
const highlight: [typeof rehypeShiki, { themes: Record<string, string>; defaultColor: boolean; addLanguageClass: boolean }] = [
  rehypeShiki,
  {
    themes: { light: 'min-light', dark: 'min-dark' },
    // 不写死 color，而是输出 --shiki-light / --shiki-dark 两个变量，由 CSS 按主题切换
    defaultColor: false,
    // 语言名要能被 code-window 读到，才能显示在标题栏右侧
    addLanguageClass: true,
  },
]

/** 目录名即 slug：velite 的 path 形如 posts/hello-world，去掉集合前缀就是 slug */
function slugFrom(path: string, prefix: string): string {
  return path.slice(prefix.length + 1)
}

const posts = defineCollection({
  name: 'Post',
  pattern: 'posts/**/index.mdx',
  schema: s
    .object({
      title: s.string().min(1).max(40),
      summary: s.string().min(20).max(160),
      date: s.isodate(),
      updated: s.isodate().optional(),
      slug: kebab.optional(),
      path: s.path(),
      tags: s.array(kebab).min(1).max(3),
      series: kebab.optional(),
      order: s.number().int().positive().optional(),
      project: s.string().optional(),
      featured: s.boolean().default(false),
      draft: s.boolean().default(false),
      // 两份派生：raw 给阅读时长与 RSS，html 给页面渲染
      raw: s.raw(),
      html: s.markdown(),
      toc: s.toc(),
    })
    .refine((p) => !p.series || p.order !== undefined, {
      message: 'series 存在时 order 必填',
      path: ['order'],
    })
    .transform(({ path, ...rest }) => ({ ...rest, slug: rest.slug ?? slugFrom(path, 'posts') })),
})

const pages = defineCollection({
  name: 'Page',
  pattern: 'pages/**/*.mdx',
  schema: s
    .object({
      title: s.string(),
      summary: s.string().optional(),
      slug: kebab.optional(),
      path: s.path(),
      html: s.markdown(),
    })
    .transform(({ path, ...rest }) => ({ ...rest, slug: rest.slug ?? slugFrom(path, 'pages') })),
})

// 项目不是文章：没有 date、不进 RSS、不进标签（ADR-0007）
const projects = defineCollection({
  name: 'Project',
  pattern: 'projects/**/index.mdx',
  schema: s
    .object({
      name: s.string().min(1).max(24),
      summary: s.string().min(20).max(80),
      status: s.enum(['active', 'done', 'archived']).default('active'),
      stack: s.array(kebab).min(1).max(5),
      repo: s.string().url().optional(),
      demo: s.string().url().optional(),
      order: s.number().int().positive().optional(),
      slug: kebab.optional(),
      path: s.path(),
      draft: s.boolean().default(false),
      html: s.markdown(),
    })
    .transform(({ path, ...rest }) => ({ ...rest, slug: rest.slug ?? slugFrom(path, 'projects') })),
})

export default defineConfig({
  root: 'content',
  // 任何一条 schema 校验失败都终止构建，不允许降级成 warning
  strict: true,
  // 不清理输出目录：构建期 react-router.config.ts 要读这里的 json，
  // clean 会短暂删空目录，和读取撞上就是 ENOENT。产物是整份重写的，没有残渣问题。
  output: { data: '.velite' },
  markdown: {
    // velite 的打包产物里复制了一份 unified 的类型，和 @shikijs/rehype 引用的那份
    // 名义上不同、运行时完全一致。只在这一个边界上收窄，不扩散到别处。
    rehypePlugins: [highlight, rehypeSlug, rehypeCodeWindow] as unknown as MarkdownOptions['rehypePlugins'],
  },
  collections: { posts, pages, projects },
})

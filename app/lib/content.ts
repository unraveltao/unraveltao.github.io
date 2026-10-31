import type { Page, Post, Project } from '#site/index'
import pagesJson from '#site/pages.json'
import postsJson from '#site/posts.json'
import projectsJson from '#site/projects.json'
import { isPublished } from './publish'

/**
 * 内容入口：把 velite 的产物收成一个类型安全的门面。
 * 页面只从这里拿数据，不直接 import #site/*.json（否则发布过滤会被复制到各处）。
 */

export type { Page, Post, Project }

/** dev 下草稿与未来日期的文章都可见，build 下才真正过滤（docs/02 §6） */
const SHOW_UNPUBLISHED = import.meta.env.DEV

export function getPublishedPosts(now = new Date()): Post[] {
  return (postsJson as Post[])
    .filter((post) => isPublished(post, now, SHOW_UNPUBLISHED))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getProjects(): Project[] {
  return (projectsJson as Project[])
    .filter((project) => SHOW_UNPUBLISHED || !project.draft)
    .sort((a, b) => {
      const ao = a.order ?? Number.MAX_SAFE_INTEGER
      const bo = b.order ?? Number.MAX_SAFE_INTEGER
      if (ao !== bo) return ao - bo
      return a.name.localeCompare(b.name, 'zh-CN')
    })
}

export function getPage(slug: string): Page {
  const page = (pagesJson as Page[]).find((item) => item.slug === slug)
  if (!page) throw new Error(`缺少 content/pages/${slug}.mdx`)
  return page
}

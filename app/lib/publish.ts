/**
 * 已发布判定的唯一实现。
 * 页面、构建期预渲染清单、RSS 三处都从这里取，不允许各写一份（AGENTS.md §5.4）。
 */
export type Publishable = { draft: boolean; date: string }

/** 已发布 = 非草稿 且 日期已到；dev 下恒为 true，草稿才能本地预览 */
export function isPublished(post: Publishable, now = new Date(), showUnpublished = false): boolean {
  if (showUnpublished) return true
  return !post.draft && new Date(post.date) <= now
}

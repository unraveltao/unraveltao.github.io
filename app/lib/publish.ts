/**
 * 已发布判定的唯一实现。
 * 页面、构建期预渲染清单、RSS 三处都从这里取，不允许各写一份（AGENTS.md §5.4）。
 */
export type Publishable = { draft: boolean; date: string }

/** 已发布 = 非草稿 且 日期已到；dev 下恒为 true，草稿才能本地预览 */
export function isPublished(post: Publishable, now = new Date(), showUnpublished = false): boolean {
  if (showUnpublished) return true
  const todayInShanghai = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
  return !post.draft && post.date.slice(0, 10) <= todayInShanghai
}

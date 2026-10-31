import type { Post } from './content'

export function groupByYear(posts: Post[]): [number, Post[]][] {
  const map = new Map<number, Post[]>()
  for (const post of posts) {
    const year = new Date(post.date).getUTCFullYear()
    if (!map.has(year)) map.set(year, [])
    map.get(year)!.push(post)
  }
  return [...map.entries()].sort((a, b) => b[0] - a[0])
}

export function collectTags(posts: Post[]): [string, number][] {
  const map = new Map<string, number>()
  for (const post of posts) {
    for (const tag of post.tags) map.set(tag, (map.get(tag) ?? 0) + 1)
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
}

/** ISO 字符串截前 10 位即 YYYY-MM-DD，与页面上的 <time datetime> 同形 */
export function formatDate(iso: string): string {
  return iso.slice(0, 10)
}

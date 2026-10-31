/** velite 的 s.toc() 产出嵌套树，页面需要的是扁平且带层级的列表 */
export type TocEntry = { title: string; url: string; items: TocEntry[] }

export type Heading = { depth: number; title: string; url: string }

export function flattenToc(entries: TocEntry[], depth = 2): Heading[] {
  return entries.flatMap((entry) => [
    { depth, title: entry.title, url: entry.url },
    ...flattenToc(entry.items, depth + 1),
  ])
}

/** url 是 #锚点，浏览器给的 href 会做百分号编码，取 id 时要还原 */
export function anchorId(url: string): string {
  return decodeURIComponent(url.replace(/^#/, ''))
}

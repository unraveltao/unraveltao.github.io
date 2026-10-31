import { useEffect, useState } from 'react'
import { anchorId, flattenToc, type TocEntry } from '~/lib/toc'

/**
 * 文章右侧目录。原站的样式语言是「一条左边框 + 11px 灰色链接」，
 * 这里沿用，只把当前项染成 accent。
 */
export function Toc({ items }: { items: TocEntry[] }) {
  const headings = flattenToc(items).filter((heading) => heading.depth === 2 || heading.depth === 3)
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (headings.length <= 2) return

    const targets = headings
      .map((heading) => document.getElementById(anchorId(heading.url)))
      .filter((element): element is HTMLElement => element !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        const first = visible[0]
        if (first) setActive(first.target.id)
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: 0 },
    )

    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [headings.length])

  if (headings.length <= 2) return null

  return (
    <nav className="article-toc" aria-label="目录">
      <h2>ON THIS NOTE</h2>
      {headings.map((heading) => (
        <a
          key={heading.url}
          href={heading.url}
          className={active === anchorId(heading.url) ? 'is-active' : undefined}
        >
          {heading.title}
        </a>
      ))}
    </nav>
  )
}

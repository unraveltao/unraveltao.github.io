import { useEffect, useState, type ReactNode } from 'react'
import { anchorId, flattenToc, type TocEntry } from '~/lib/toc'

/**
 * 文章右侧目录。样式沿用参考站的 .article-toc：
 * 一条左边框 + 11px 灰链接，当前项染成 accent。
 *
 * children 用来塞 aside 里的其余内容（下载按钮、系列导航）——参考站把
 * 「Download Markdown」也放在同一个 .article-toc 里，所以这里保留同一容器。
 */
export function Toc({ items, children }: { items: TocEntry[]; children?: ReactNode }) {
  const headings = flattenToc(items).filter((heading) => heading.depth === 2 || heading.depth === 3)
  const [active, setActive] = useState<string | null>(null)
  const enough = headings.length > 2

  useEffect(() => {
    if (!enough) return

    // 依赖用 items（内容层的常量）而不是 headings（每次渲染新建的数组），否则观察器会被反复重建
    const targets = flattenToc(items)
      .filter((heading) => heading.depth === 2 || heading.depth === 3)
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
  }, [enough, items])

  return (
    <nav className="article-toc" aria-label="Table of contents">
      {enough && (
        <>
          <h2>IN THIS NOTE</h2>
          {headings.map((heading) => (
            <a
              key={heading.url}
              href={heading.url}
              className={active === anchorId(heading.url) ? 'is-active' : undefined}
            >
              {heading.title}
            </a>
          ))}
        </>
      )}
      {children}
    </nav>
  )
}

import { useEffect, useState } from 'react'
import { anchorId, flattenToc, type TocEntry } from '~/lib/toc'
import styles from './Toc.module.css'

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
    <aside className={styles.toc} aria-label="目录">
      <p className={`meta ${styles.title}`}>on this page</p>
      <ul className={styles.list}>
        {headings.map((heading) => (
          <li
            key={heading.url}
            className={`${styles.item} ${heading.depth === 3 ? styles.itemH3 : ''}`}
          >
            <a
              href={heading.url}
              className={active === anchorId(heading.url) ? styles.isActive : undefined}
            >
              {heading.title}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}

import { useEffect, useMemo, useRef, useState } from 'react'
import { getProjects, getPublishedPosts } from '~/lib/content'
import { Icon } from './Icon'

/**
 * 全局搜索：按钮 + <dialog>，都放在这里，Header 只负责摆位置。
 *
 * 用原生 <dialog>：Esc 关闭、焦点陷阱、backdrop 都由浏览器负责，
 * 比自己拿 div 拼一层要少一半代码（参考站也是这么做的）。
 */

type Result = {
  title: string
  text: string
  type: 'Writing' | 'Project'
  url: string
}

export function SearchDialog() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const index = useMemo<Result[]>(() => {
    const posts = getPublishedPosts().map<Result>((post) => ({
      title: post.title,
      text: post.summary,
      type: 'Writing',
      url: `/posts/${post.slug}/`,
    }))
    const projects = getProjects().map<Result>((project) => ({
      title: project.name,
      text: project.summary,
      type: 'Project',
      url: `/projects/${project.slug}/`,
    }))
    return [...posts, ...projects]
  }, [])

  const results = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (!keyword) return index
    return index.filter((item) => `${item.title} ${item.text}`.toLowerCase().includes(keyword))
  }, [index, query])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
      setQuery('')
      inputRef.current?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <>
      <button
        type="button"
        className="icon-button"
        aria-label="Search this site"
        title="Search (Ctrl/⌘ K)"
        onClick={() => setOpen(true)}
      >
        <Icon name="search" />
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="search-title"
        onClose={() => setOpen(false)}
        onClick={(event) => {
          // 点 backdrop 关闭：<dialog> 自身就是 backdrop 的命中目标
          if (event.target === dialogRef.current) setOpen(false)
        }}
      >
        <div className="search-top">
          <Icon name="search" />
          <label className="sr-only" htmlFor="global-search" id="search-title">
            Search this site
          </label>
          <input
            ref={inputRef}
            type="search"
            id="global-search"
            placeholder="Search writing and projects…"
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="button" className="icon-button" aria-label="Close search" onClick={() => setOpen(false)}>
            <Icon name="close" />
          </button>
        </div>

        <div id="search-results">
          {results.length > 0 ? (
            results.map((item) => (
              <a className="search-result" key={item.url} href={item.url} onClick={() => setOpen(false)}>
                <span>{item.type}</span>
                <strong>{item.title}</strong>
                <small>{item.text}</small>
              </a>
            ))
          ) : (
            <div className="search-empty">No matches. Try “Lattice” or “Markdown”.</div>
          )}
        </div>

        <div className="search-hint">
          A small garden. Everything is within reach. <kbd>esc</kbd> to close
        </div>
      </dialog>
    </>
  )
}

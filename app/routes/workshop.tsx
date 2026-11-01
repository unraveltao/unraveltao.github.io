import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { Icon } from '~/components/Icon'
import { pageMeta } from '~/lib/seo'

export const meta = () =>
  pageMeta({
    path: '/workshop',
    title: 'Workshop',
    description:
      'A quiet place for repeatable tasks. Start with a clean Markdown file, ready to take back to your vault.',
  })

/**
 * 版式与交互取自参考站 workshop()：左侧表单，右侧输出 + 最近打包，底部说明条。
 * 全部在浏览器里跑——草稿写 localStorage，导出走 Blob，不上传任何内容。
 */

const DRAFT_KEY = 'garden-draft'
const HISTORY_KEY = 'garden-history'

type Draft = {
  title: string
  slug: string
  date: string
  tags: string
  summary: string
  body: string
}

type Package = { name: string; date: string }

const EMPTY: Draft = { title: '', slug: '', date: '', tags: '', summary: '', body: '' }

function read<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

function slugify(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

function today(): string {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export default function Workshop() {
  const [draft, setDraft] = useState<Draft>(EMPTY)
  const [manualSlug, setManualSlug] = useState(false)
  const [output, setOutput] = useState('')
  const [filename, setFilename] = useState('')
  const [history, setHistory] = useState<Package[]>([])
  const [restored, setRestored] = useState(false)
  const [saved, setSaved] = useState(true)
  const [toast, setToast] = useState('')
  const timer = useRef<number | undefined>(undefined)

  // localStorage 只能在客户端读，所以草稿在挂载后一次性恢复
  useEffect(() => {
    const stored = read<Partial<Draft>>(DRAFT_KEY, {})
    setDraft({ ...EMPTY, date: today(), ...stored })
    setManualSlug(Boolean(stored.slug))
    setRestored(Boolean(stored.title))
    setHistory(read<Package[]>(HISTORY_KEY, []))
  }, [])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const notify = (message: string) => {
    setToast(message)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setToast(''), 3200)
  }

  const update = (key: keyof Draft, value: string) => {
    const next = { ...draft, [key]: value }
    // 标题自动生成 slug，直到用户自己动过 slug 字段（和参考站一致）
    if (key === 'title' && !manualSlug) next.slug = slugify(value)
    if (key === 'slug') setManualSlug(true)
    setDraft(next)
    setSaved(write(DRAFT_KEY, next))
    if (output) {
      setOutput('')
      setFilename('')
    }
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!draft.title.trim() || !draft.body.trim()) {
      notify('Add a title and some note text first.')
      return
    }

    const quote = (value: string) => JSON.stringify(value.trim())
    const tags = [...new Set(draft.tags.split(',').map((tag) => tag.trim()).filter(Boolean))]
    const markdown = [
      '---',
      `title: ${quote(draft.title)}`,
      `slug: ${draft.slug}`,
      `date: ${draft.date}`,
      `summary: ${quote(draft.summary)}`,
      `tags: ${JSON.stringify(tags)}`,
      'status: draft',
      '---',
      '',
      `# ${draft.title.trim().replace(/[\r\n]+/g, ' ')}`,
      '',
      draft.body.trim(),
      '',
    ].join('\n')

    setOutput(markdown)
    setFilename(`${draft.slug}.md`)

    const entry: Package = {
      name: draft.slug,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    const next = [entry, ...history].slice(0, 5)
    setHistory(next)
    write(HISTORY_KEY, next)
    notify('Packaged as a draft. Ready for your vault.')
  }

  const download = () => {
    if (!output) return
    const url = URL.createObjectURL(new Blob([output], { type: 'text/markdown;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.append(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    notify('Markdown download started.')
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output)
      notify('Markdown copied.')
    } catch {
      notify('Clipboard unavailable. Use Download .md instead.')
    }
  }

  return (
    <>
      <header className="page-head">
        <div className="eyebrow">THE LITTLE WORKSHOP</div>
        <h1>Small tools. Less friction.</h1>
        <p>
          A quiet place for repeatable tasks. Start with a clean Markdown file, ready to take back to
          your vault.
        </p>
      </header>

      <div className="workshop-layout">
        <form className="tool-panel" onSubmit={submit}>
          <div className="panel-heading">
            <h2>Markdown packager</h2>
            <span>01 / CONTENT TOOL</span>
          </div>

          <div className="field">
            <label htmlFor="note-title">
              Article title <span aria-hidden="true">*</span>
            </label>
            <input
              id="note-title"
              name="title"
              placeholder="An idea worth keeping"
              required
              maxLength={160}
              value={draft.title}
              onChange={(event) => update('title', event.target.value)}
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="note-slug">
                URL slug <span aria-hidden="true">*</span>
              </label>
              <input
                id="note-slug"
                name="slug"
                placeholder="an-idea-worth-keeping"
                required
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                maxLength={80}
                title="Lowercase English letters, numbers, and single hyphens"
                value={draft.slug}
                onChange={(event) => update('slug', event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="note-date">
                Date <span aria-hidden="true">*</span>
              </label>
              <input
                id="note-date"
                name="date"
                type="date"
                required
                value={draft.date}
                onChange={(event) => update('date', event.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="note-tags">
              Tags <span className="field-hint">(comma separated)</span>
            </label>
            <input
              id="note-tags"
              name="tags"
              placeholder="Building, Notes"
              maxLength={200}
              value={draft.tags}
              onChange={(event) => update('tags', event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="note-summary">Short summary</label>
            <input
              id="note-summary"
              name="summary"
              placeholder="One sentence to open the door."
              maxLength={300}
              value={draft.summary}
              onChange={(event) => update('summary', event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="note-body">
              Your note <span aria-hidden="true">*</span>
            </label>
            <textarea
              id="note-body"
              name="body"
              placeholder={'## A small beginning\n\nWrite something worth coming back to…'}
              required
              maxLength={100000}
              value={draft.body}
              onChange={(event) => update('body', event.target.value)}
            />
            <p className="field-hint">Markdown supported. Your exported note starts as a draft.</p>
          </div>

          <div className="tool-actions">
            <button className="button primary" type="submit">
              Package note <Icon name="arrow" />
            </button>
            <span className="tool-status">
              {!saved
                ? 'Local saving unavailable'
                : restored
                  ? 'Draft restored locally'
                  : 'Saved in this browser as you write'}
            </span>
          </div>
        </form>

        <div>
          <section className="tool-panel" aria-labelledby="output-heading">
            <div className="panel-heading">
              <h2 id="output-heading">Ready for your vault</h2>
              <span>{filename || '.MD'}</span>
            </div>

            <div aria-live="polite">
              {output ? (
                <pre className="output-pre">{output}</pre>
              ) : (
                <div className="output-placeholder">
                  <Icon name="file" />
                  <p>A little structure for your ideas.</p>
                  <small>
                    Fill in your note and package it.
                    <br />
                    Your Markdown file will appear here.
                  </small>
                </div>
              )}
            </div>

            <div className="output-actions">
              <button className="button" type="button" onClick={download} disabled={!output}>
                <Icon name="download" /> Download .md
              </button>
              <button className="button" type="button" onClick={copy} disabled={!output}>
                <Icon name="copy" /> Copy
              </button>
            </div>
          </section>

          <section className="history-box">
            <div className="section-heading">
              <h2 style={{ fontSize: 19 }}>Recent packages</h2>
              <span className="eyebrow" style={{ fontSize: 8 }}>
                THIS BROWSER
              </span>
            </div>
            {history.length > 0 ? (
              history.map((item) => (
                <div className="history-row" key={`${item.name}-${item.date}`}>
                  <Icon name="check" />
                  <span>{item.name}.md</span>
                  <time>{item.date}</time>
                </div>
              ))
            ) : (
              <p className="field-hint">Your packaged notes will be listed here.</p>
            )}
          </section>
        </div>
      </div>

      <div className="workshop-footnote">
        <Icon name="lock" />
        <p>
          <strong>Made here. Kept here.</strong> Processing happens in your browser. Drafts and recent
          package names are stored locally on this device. Downloaded files are yours to keep.
        </p>
        <Link className="text-link" to="/workflow/">
          The writing workflow <Icon name="arrow" />
        </Link>
      </div>

      <div className={toast ? 'toast visible' : 'toast'} role="status" aria-live="polite">
        {toast}
      </div>
    </>
  )
}

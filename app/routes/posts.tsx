import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { Icon } from '~/components/Icon'
import { PostRow } from '~/components/PostRow'
import { getPublishedPosts } from '~/lib/content'
import { pageMeta } from '~/lib/seo'

const PAGE_SIZE = 20
const PREVIEW_PARAM = 'pagination-preview'

export const meta = () =>
  pageMeta({
    path: '/posts',
    title: 'Writing',
    description: 'Selected notes on methods, technical decisions, and lessons from practice.',
  })

/** Temporary fixtures for reviewing the 20-post page break; remove after preview approval. */
function makePaginationPreview(posts: ReturnType<typeof getPublishedPosts>) {
  if (posts.length === 0) return posts
  return Array.from({ length: 30 }, (_, index) => {
    const source = posts[index % posts.length]
    const date = new Date(Date.UTC(2026, 10, 20 - index)).toISOString().slice(0, 10)
    return {
      ...source,
      date,
      title: `Pagination preview article ${String(index + 1).padStart(2, '0')}`,
      summary: 'Temporary sample entry for checking the 20-post pagination layout.',
    }
  })
}

/** A focused writing index with search and a reverse-chronological timeline. */
export default function Posts() {
  const publishedPosts = getPublishedPosts()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const previewEnabled = searchParams.get(PREVIEW_PARAM) === '30'

  const posts = useMemo(
    () => (previewEnabled ? makePaginationPreview(publishedPosts) : publishedPosts),
    [previewEnabled, publishedPosts],
  )

  const results = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (!keyword) return posts
    return posts.filter((post) =>
      `${post.title} ${post.summary} ${post.tags.join(' ')} ${post.raw}`.toLowerCase().includes(keyword),
    )
  }, [posts, query])

  const pageCount = Math.ceil(results.length / PAGE_SIZE)
  const requestedPage = Math.max(1, Number(searchParams.get('page')) || 1)
  const currentPage = Math.min(requestedPage, Math.max(1, pageCount))
  const pageResults = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function goToPage(page: number) {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      if (page === 1) next.delete('page')
      else next.set('page', String(page))
      return next
    }, { preventScrollReset: true })
  }

  function updateQuery(value: string) {
    setQuery(value)
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      next.delete('page')
      return next
    }, { preventScrollReset: true })
  }

  return (
    <>
      <header className="page-head">
        <div className="eyebrow">SELECTED WRITING</div>
        <h1>Methods and ideas worth keeping.</h1>
        <p>Notes on software, technical decisions, and lessons from practice.</p>
      </header>

      <div className="writing-controls">
        <label className="search-field">
          <Icon name="search" />
          <span className="sr-only">Search writing</span>
          <input
            type="search"
            placeholder="Find a note…"
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
          />
        </label>
      </div>

      <div id="writing-results">
        {previewEnabled && (
          <p className="pagination-preview-note" role="status">
            Temporary preview data: 30 entries, with 20 shown per page.
          </p>
        )}
        <div className="result-count" role="status">
          {results.length} {results.length === 1 ? 'note' : 'notes'}
          {query.trim() ? ' found' : ''}
          {pageCount > 1 ? ` · ${PAGE_SIZE} per page` : ''}
        </div>

        {results.length > 0 ? (
          <>
            <div className="writing-list writing-timeline">
              {pageResults.map((post, index) => (
                <PostRow key={`${post.slug}-${index}`} post={post} timeline timelineIndex={index + 1} />
              ))}
            </div>
            {pageCount > 1 && (
              <nav className="writing-pagination" aria-label="Writing pages">
                <button
                  type="button"
                  aria-label="Previous page"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <Icon name="arrow" className="writing-pagination-previous" />
                </button>
                <span aria-live="polite">{currentPage} / {pageCount}</span>
                <button
                  type="button"
                  aria-label="Next page"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === pageCount}
                >
                  <Icon name="arrow" />
                </button>
              </nav>
            )}
          </>
        ) : (
          <div className="empty-state">
            <h2>No notes in this corner yet.</h2>
            <p>Try another phrase or explore all the notes.</p>
            <button type="button" className="button" onClick={() => updateQuery('')}>
              Clear search <Icon name="arrow" />
            </button>
          </div>
        )}
      </div>
    </>
  )
}

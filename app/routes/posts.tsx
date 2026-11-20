import { useMemo, useState } from 'react'
import { Icon } from '~/components/Icon'
import { PostRow } from '~/components/PostRow'
import { getPublishedPosts } from '~/lib/content'
import { pageMeta } from '~/lib/seo'

export const meta = () =>
  pageMeta({
    path: '/posts',
    title: 'Writing',
    description: 'Selected notes on methods, technical decisions, and lessons from practice.',
  })

/** A focused writing index with search and a reverse-chronological timeline. */
export default function Posts() {
  const posts = getPublishedPosts()
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (!keyword) return posts
    return posts.filter((post) =>
      `${post.title} ${post.summary} ${post.tags.join(' ')} ${post.raw}`.toLowerCase().includes(keyword),
    )
  }, [posts, query])

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
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>

      <div id="writing-results">
        <div className="result-count" role="status">
          {results.length} {results.length === 1 ? 'note' : 'notes'}
          {query.trim() ? ' found' : ''}
        </div>

        {results.length > 0 ? (
          <div className="writing-list writing-timeline">
            {results.map((post) => (
              <PostRow key={post.slug} post={post} timeline />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>No notes in this corner yet.</h2>
            <p>Try another phrase or explore all the notes.</p>
            <button type="button" className="button" onClick={() => setQuery('')}>
              Clear search <Icon name="arrow" />
            </button>
          </div>
        )}
      </div>
    </>
  )
}

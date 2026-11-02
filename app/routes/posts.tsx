import { useMemo, useState } from 'react'
import { Icon } from '~/components/Icon'
import { PostRow } from '~/components/PostRow'
import { getPublishedPosts } from '~/lib/content'
import { pageMeta } from '~/lib/seo'

export const meta = () =>
  pageMeta({
    path: '/posts',
    title: '写作',
    description:
      '精选方法论、技术取舍与实践总结，只收录值得长期引用的结论。',
  })

/**
 * 版式取自参考站 writing()：页头 → 标签筛选 + 搜索框 → 结果计数 + 列表。
 * 筛选与搜索都在客户端做，数据量是几十篇，不需要更复杂的索引。
 */
export default function Posts() {
  const posts = getPublishedPosts()
  const [tag, setTag] = useState('All')
  const [query, setQuery] = useState('')

  const tags = useMemo(() => ['All', ...new Set(posts.flatMap((post) => post.tags))], [posts])

  const results = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return posts.filter((post) => {
      if (tag !== 'All' && !post.tags.includes(tag)) return false
      if (!keyword) return true
      return `${post.title} ${post.summary} ${post.tags.join(' ')} ${post.raw}`.toLowerCase().includes(keyword)
    })
  }, [posts, tag, query])

  const reset = () => {
    setTag('All')
    setQuery('')
  }

  return (
    <>
      <header className="page-head">
        <div className="eyebrow">精选技术写作</div>
        <h1>值得留下的方法与判断。</h1>
        <p>
          方法论、关键技术取舍与实践总结。有明确的结论，也有支撑结论的过程。
        </p>
      </header>

      <div className="writing-controls">
        <div className="filter-chips" role="group" aria-label="Filter writing by tag">
          {tags.map((item) => (
            <button
              key={item}
              type="button"
              className="filter-chip"
              data-filter={item}
              aria-pressed={tag === item}
              onClick={() => setTag(item)}
            >
              {item}
            </button>
          ))}
        </div>

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
          <div className="writing-list">
            {results.map((post) => (
              <PostRow key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>No notes in this corner yet.</h2>
            <p>Try another phrase or explore all the notes.</p>
            <button type="button" className="button" onClick={reset}>
              Clear filters <Icon name="arrow" />
            </button>
          </div>
        )}
      </div>
    </>
  )
}

import { useMemo, useState } from 'react'
import { Icon } from '~/components/Icon'
import { PostRow } from '~/components/PostRow'
import { getPublishedPosts } from '~/lib/content'
import { collectTags } from '~/lib/posts'
import { pageMeta } from '~/lib/seo'

export const meta = () =>
  pageMeta({ path: '/posts', title: '文章', description: '全部文章，按时间倒序。' })

const ALL = '全部'

export default function Posts() {
  const posts = getPublishedPosts()
  const tags = useMemo(() => [ALL, ...collectTags(posts).map(([tag]) => tag)], [posts])
  const [activeTag, setActiveTag] = useState(ALL)
  const [query, setQuery] = useState('')

  // 筛选和搜索都在客户端做：文章总数不到 30，没必要为它生成更多静态页
  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return posts.filter((post) => {
      const matchTag = activeTag === ALL || post.tags.includes(activeTag)
      const matchQuery =
        keyword === '' ||
        `${post.title} ${post.summary} ${post.tags.join(' ')}`.toLowerCase().includes(keyword)
      return matchTag && matchQuery
    })
  }, [posts, activeTag, query])

  return (
    <div className="shell">
      <div className="page-head">
        <p className="eyebrow">NOTES FROM THE PROCESS</p>
        <h1>写下来的判断。</h1>
        <p>想法、踩过的坑、以及那些「当时只能这样选」的理由。一篇一个结论。</p>
      </div>

      <div className="writing-controls">
        <div className="filter-chips" role="group" aria-label="按标签筛选">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className="filter-chip"
              aria-pressed={tag === activeTag}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        <label className="search-field">
          <Icon name="search" />
          <span className="sr-only">搜索文章</span>
          <input
            type="search"
            placeholder="找一篇笔记…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>

      <p className="result-count" role="status">
        {filtered.length} 篇{query.trim() ? '匹配' : ''}
      </p>

      {filtered.length > 0 ? (
        <div className="writing-list">
          {filtered.map((post) => (
            <PostRow key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>这个角落还没有内容。</h2>
          <p>换个词，或者看看全部文章。</p>
          <button
            type="button"
            className="button"
            onClick={() => {
              setActiveTag(ALL)
              setQuery('')
            }}
          >
            清空筛选 <Icon name="arrow" />
          </button>
        </div>
      )}
    </div>
  )
}

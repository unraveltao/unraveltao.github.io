import { Link } from 'react-router'
import type { Post } from '~/lib/content'
import { readingTime } from '~/lib/reading-time'
import { Icon } from './Icon'

/** 参考站的日期格式：Oct 22（不带年份） */
const DATE = new Intl.DateTimeFormat('en', { month: 'short', day: '2-digit', timeZone: 'UTC' })

function formatDate(iso: string): string {
  return DATE.format(new Date(`${iso.slice(0, 10)}T00:00:00Z`))
}

/**
 * 文章行：日期 | 标题+摘要 | 箭头。
 * compact 用于首页（只留日期、标题、摘要），完整版多一行元信息。
 */
export function PostRow({ post, compact = false }: { post: Post; compact?: boolean }) {
  return (
    <Link className="writing-row" to={`/posts/${post.slug}/`}>
      <time dateTime={post.date.slice(0, 10)}>{formatDate(post.date)}</time>
      <div>
        <h3>{post.title}</h3>
        <p>{post.summary}</p>
        {!compact && (
          <div className="row-meta">
            <span>{post.tags.join(' · ')}</span>
            <span>{readingTime(post.raw)} min read</span>
          </div>
        )}
      </div>
      <Icon name="arrow" />
    </Link>
  )
}

export { formatDate }

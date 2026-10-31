import { Link } from 'react-router'
import type { Post } from '~/lib/content'
import { formatDate } from '~/lib/posts'
import { readingTime } from '~/lib/reading-time'
import { Icon } from './Icon'

/**
 * 文章行：日期 | 标题+摘要 | 箭头。
 * compact 用于首页（只留日期、标题、摘要），完整版多一行元信息。
 */
export function PostRow({ post, compact = false }: { post: Post; compact?: boolean }) {
  return (
    <Link className="writing-row" to={`/posts/${post.slug}/`}>
      <time dateTime={formatDate(post.date)}>{formatDate(post.date)}</time>
      <div>
        <h3>{post.title}</h3>
        <p>{post.summary}</p>
        {!compact && (
          <div className="row-meta">
            <span>{post.tags.map((tag) => `#${tag}`).join(' ')}</span>
            <span>{readingTime(post.raw)} min</span>
          </div>
        )}
      </div>
      <Icon name="arrow" />
    </Link>
  )
}

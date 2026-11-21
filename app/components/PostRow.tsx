import { Link } from 'react-router'
import type { Post } from '~/lib/content'
import { readingTime } from '~/lib/reading-time'
import { postCategoryName } from '~/lib/post-categories'
import { Icon } from './Icon'

const DATE = new Intl.DateTimeFormat('en', { month: 'short', day: '2-digit', timeZone: 'UTC' })

function formatDate(iso: string): string {
  return DATE.format(new Date(`${iso.slice(0, 10)}T00:00:00Z`))
}

/** A writing row with an optional chronological timeline marker and index. */
export function PostRow({
  post,
  compact = false,
  timeline = false,
  timelineIndex,
}: {
  post: Post
  compact?: boolean
  timeline?: boolean
  timelineIndex?: number
}) {
  const className = `writing-row${compact ? ' writing-row-compact' : ''}${timeline ? ' writing-row-timeline' : ''}`

  return (
    <Link className={className} to={`/posts/${post.slug}/`}>
      <time dateTime={post.date.slice(0, 10)}>{formatDate(post.date)}</time>
      {timeline && (
        <span className="writing-timeline-index" aria-hidden="true">
          {String(timelineIndex ?? 1).padStart(2, '0')}
        </span>
      )}
      {timeline && <span className="writing-timeline-marker" aria-hidden="true" />}
      <div className={timeline ? 'writing-row-content' : undefined}>
        <span className="post-category-label" data-category={post.category}>{postCategoryName(post.category)}</span>
        <h3>{post.title}</h3>
        <p>{post.summary}</p>
        {!compact && (
          <div className="row-meta">
            <span>{readingTime(post.raw)} min read</span>
          </div>
        )}
      </div>
      <Icon name="arrow" className={timeline ? 'writing-row-open' : undefined} />
    </Link>
  )
}

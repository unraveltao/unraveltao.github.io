import { Link } from 'react-router'
import type { Post } from '~/lib/content'
import { formatDate } from '~/lib/posts'
import styles from './PostItem.module.css'

export function PostItem({ post }: { post: Post }) {
  return (
    <li className="post-item">
      <Link className={styles.link} to={`/posts/${post.slug}/`}>
        <span className="post-item__date">
          <time className="meta" dateTime={formatDate(post.date)}>
            {formatDate(post.date)}
          </time>
          {post.draft && <span className={`meta ${styles.draft}`}>草稿</span>}
        </span>
        <span className="post-item__title">{post.title}</span>
        <p className="post-item__summary">{post.summary}</p>
      </Link>
    </li>
  )
}

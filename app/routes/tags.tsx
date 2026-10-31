import { Link } from 'react-router'
import { getPublishedPosts } from '~/lib/content'
import { collectTags } from '~/lib/posts'
import { pageMeta } from '~/lib/seo'
import styles from './tags.module.css'

export const meta = () => pageMeta({ path: '/tags', title: 'tags', description: '全部标签。' })

export default function Tags() {
  const tags = collectTags(getPublishedPosts())

  return (
    <div className="wrap">
      <header className={styles.pageHead}>
        <h1 className={styles.pageHeadTitle}>tags</h1>
        <p className="meta">{tags.length} 个</p>
      </header>

      <ul className={styles.list}>
        {tags.map(([tag, count]) => (
          <li key={tag}>
            <Link to={`/tags/${tag}/`}>
              <span className="tag">#{tag}</span>
              <span className={`meta ${styles.count}`}>{count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

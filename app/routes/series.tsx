import type { MetaFunction } from 'react-router'
import { useParams } from 'react-router'
import { getPublishedPosts } from '~/lib/content'
import { pageMeta } from '~/lib/seo'
import { seriesDescription, seriesName } from '~/lib/series'
import styles from './series.module.css'

export const meta: MetaFunction<{ series: string }> = ({ params }) => {
  const key = params.series ?? ''
  return pageMeta({
    path: `/series/${key}`,
    title: seriesName(key),
    description: seriesDescription(key) ?? `${seriesName(key)} 系列`,
  })
}

export default function Series() {
  const { series: key = '' } = useParams()
  const posts = getPublishedPosts()
    .filter((post) => post.series === key)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  const description = seriesDescription(key)

  return (
    <div className="wrap">
      <header className={styles.pageHead}>
        <p className="meta">series</p>
        <h1 className={styles.pageHeadTitle}>{seriesName(key)}</h1>
        {description && <p className={styles.pageHeadDesc}>{description}</p>}
        <p className="meta">{posts.length} 篇</p>
      </header>

      <ol className={styles.list}>
        {posts.map((post, index) => (
          <li key={post.slug}>
            <span className={`meta ${styles.index}`}>{String(index + 1).padStart(2, '0')}</span>
            <a href={`/posts/${post.slug}/`}>
              <span className={styles.title}>{post.title}</span>
              <span className={styles.summary}>{post.summary}</span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  )
}

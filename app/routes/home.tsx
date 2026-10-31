import { Link } from 'react-router'
import { PostList } from '~/components/PostList'
import { getPublishedPosts } from '~/lib/content'
import { formatDate } from '~/lib/posts'
import { readingTime } from '~/lib/reading-time'
import { pageMeta } from '~/lib/seo'
import { SITE_NAME, SITE_TAGLINE } from '~/lib/site'
import styles from './home.module.css'

export const meta = () => pageMeta({ path: '/' })

export default function Home() {
  const posts = getPublishedPosts()
  const featured = posts.find((post) => post.featured)
  const rest = posts.filter((post) => post.slug !== featured?.slug).slice(0, 10)

  return (
    <div className="wrap">
      <section className={styles.hero}>
        <h1 className={styles.heroName}>{SITE_NAME}</h1>
        <p className={styles.heroTagline}>{SITE_TAGLINE}</p>
      </section>

      {featured && (
        <section className={styles.featured}>
          <p className={`meta ${styles.featuredLabel}`}>selected</p>
          <Link className={styles.featuredLink} to={`/posts/${featured.slug}/`}>
            <h2 className={styles.featuredTitle}>{featured.title}</h2>
            <p className={styles.featuredSummary}>{featured.summary}</p>
            <p className="meta">
              {formatDate(featured.date)} · {readingTime(featured.raw)} min
            </p>
          </Link>
        </section>
      )}

      <section className={styles.recent}>
        {rest.length > 0 ? (
          <PostList posts={rest} />
        ) : (
          <p className={`meta ${styles.empty}`}>还没有文章。</p>
        )}
      </section>
    </div>
  )
}

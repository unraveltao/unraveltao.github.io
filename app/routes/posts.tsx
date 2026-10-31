import { PostList } from '~/components/PostList'
import { getPublishedPosts } from '~/lib/content'
import { pageMeta } from '~/lib/seo'
import styles from './posts.module.css'

export const meta = () =>
  pageMeta({ path: '/posts', title: 'writing', description: '全部文章，按年份排列。' })

export default function Posts() {
  const posts = getPublishedPosts()

  return (
    <div className="wrap">
      <header className={styles.pageHead}>
        <h1 className={styles.pageHeadTitle}>writing</h1>
        <p className="meta">{posts.length} 篇</p>
      </header>
      <PostList posts={posts} grouped />
    </div>
  )
}

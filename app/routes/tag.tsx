import type { MetaFunction } from 'react-router'
import { useParams } from 'react-router'
import { PostList } from '~/components/PostList'
import { getPublishedPosts } from '~/lib/content'
import { pageMeta } from '~/lib/seo'
import styles from './tag.module.css'

export const meta: MetaFunction<{ tag: string }> = ({ params }) => {
  const tag = params.tag ?? ''
  return pageMeta({
    path: `/tags/${tag}`,
    title: `#${tag}`,
    description: `标签 #${tag} 下的全部文章。`,
  })
}

export default function Tag() {
  const { tag = '' } = useParams()
  const posts = getPublishedPosts().filter((post) => post.tags.includes(tag))

  return (
    <div className="wrap">
      <header className={styles.pageHead}>
        <h1 className={styles.pageHeadTitle}>#{tag}</h1>
        <p className="meta">{posts.length} 篇</p>
      </header>
      <PostList posts={posts} />
    </div>
  )
}

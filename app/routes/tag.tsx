import type { MetaFunction } from 'react-router'
import { Link, useParams } from 'react-router'
import { Icon } from '~/components/Icon'
import { PostRow } from '~/components/PostRow'
import { getPublishedPosts } from '~/lib/content'
import { pageMeta } from '~/lib/seo'

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
    <div className="shell">
      <Link className="back-link" to="/tags/">
        <Icon name="arrow" /> 全部标签
      </Link>

      <div className="page-head">
        <p className="eyebrow">TAGGED</p>
        <h1>#{tag}</h1>
        <p>{posts.length} 篇</p>
      </div>

      <div className="writing-list">
        {posts.map((post) => (
          <PostRow key={post.slug} post={post} />
        ))}
      </div>
    </div>
  )
}

import { Link } from 'react-router'
import { getPublishedPosts } from '~/lib/content'
import { collectTags } from '~/lib/posts'
import { pageMeta } from '~/lib/seo'

export const meta = () => pageMeta({ path: '/tags', title: '标签', description: '全部标签。' })

export default function Tags() {
  const tags = collectTags(getPublishedPosts())

  return (
    <div className="shell">
      <div className="page-head">
        <p className="eyebrow">ALL TAGS</p>
        <h1>标签。</h1>
        <p>{tags.length} 个标签，点进去是这个方向的全部文章。</p>
      </div>

      <ul className="tag-cloud">
        {tags.map(([tag, count]) => (
          <li key={tag}>
            <Link to={`/tags/${tag}/`}>
              <span className="tag">#{tag}</span>
              <span className="tag-count">{count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

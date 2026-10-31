import type { MetaFunction } from 'react-router'
import { Link, useParams } from 'react-router'
import { Icon } from '~/components/Icon'
import { getPublishedPosts } from '~/lib/content'
import { pageMeta } from '~/lib/seo'
import { seriesDescription, seriesName } from '~/lib/series'

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
    <div className="shell">
      <div className="page-head">
        <p className="eyebrow">SERIES · {posts.length} PARTS</p>
        <h1>{seriesName(key)}</h1>
        {description && <p>{description}</p>}
      </div>

      <div className="writing-list">
        {posts.map((post, index) => (
          <Link className="writing-row" key={post.slug} to={`/posts/${post.slug}/`}>
            <span className="order">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h3>{post.title}</h3>
              <p>{post.summary}</p>
            </div>
            <Icon name="arrow" />
          </Link>
        ))}
      </div>
    </div>
  )
}

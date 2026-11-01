import type { MetaFunction } from 'react-router'
import { Link, useParams } from 'react-router'
import { Icon } from '~/components/Icon'
import { PostRow } from '~/components/PostRow'
import { getPublishedPosts } from '~/lib/content'
import { pageMeta } from '~/lib/seo'
import { seriesDescription, seriesName } from '~/lib/series'

export const meta: MetaFunction<{ series: string }> = ({ params }) => {
  const key = params.series ?? ''
  return pageMeta({
    path: `/series/${key}`,
    title: seriesName(key),
    description: seriesDescription(key) ?? `${seriesName(key)} — a series of notes.`,
  })
}

/** 参考站没有系列页，这里沿用它的 page-head + writing-list，保持同一套排版语汇 */
export default function Series() {
  const { series: key = '' } = useParams()
  const posts = getPublishedPosts()
    .filter((post) => post.series === key)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  const description = seriesDescription(key)

  return (
    <>
      <header className="page-head">
        <div className="eyebrow">SERIES</div>
        <h1>{seriesName(key)}</h1>
        {description && <p>{description}</p>}
      </header>

      <div className="result-count" role="status">
        {posts.length} {posts.length === 1 ? 'note' : 'notes'}
      </div>

      <div className="writing-list">
        {posts.map((post) => (
          <PostRow key={post.slug} post={post} />
        ))}
      </div>

      <div className="article-bottom">
        <Link className="text-link" to="/posts/">
          <Icon name="arrow" /> All writing
        </Link>
        <Link className="text-link" to="/projects/">
          See the project <Icon name="out" />
        </Link>
      </div>
    </>
  )
}

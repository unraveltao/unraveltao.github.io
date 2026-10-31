import type { MetaFunction } from 'react-router'
import { Link, useParams } from 'react-router'
import { Icon } from '~/components/Icon'
import { Toc } from '~/components/Toc'
import { getPublishedPosts, type Post } from '~/lib/content'
import { formatDate } from '~/lib/posts'
import { readingTime } from '~/lib/reading-time'
import { pageMeta } from '~/lib/seo'
import { seriesName } from '~/lib/series'
import { SITE_AUTHOR, SITE_URL } from '~/lib/site'

function findPost(slug: string | undefined): Post {
  const post = getPublishedPosts().find((item) => item.slug === slug)
  if (!post) throw new Response('Not Found', { status: 404 })
  return post
}

export const meta: MetaFunction<{ slug: string }> = ({ params }) => {
  const post = findPost(params.slug)
  const pageUrl = new URL(`/posts/${post.slug}`, SITE_URL).href
  const ogImage = new URL('/og.png', SITE_URL).href

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.updated ?? post.date).toISOString(),
    author: { '@type': 'Person', name: SITE_AUTHOR },
    image: ogImage,
    inLanguage: 'zh-CN',
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
  }

  return [
    ...pageMeta({
      path: `/posts/${post.slug}`,
      title: post.title,
      description: post.summary,
      ogType: 'article',
      publishedTime: new Date(post.date).toISOString(),
    }),
    { 'script:ld+json': jsonLd },
  ]
}

export default function PostRoute() {
  const { slug } = useParams()
  const post = findPost(slug)

  const all = getPublishedPosts()
  const index = all.findIndex((item) => item.slug === post.slug)
  // all 按日期倒序，所以 index-1 更新、index+1 更旧
  const newer = all[index - 1] ?? null
  const older = all[index + 1] ?? null

  const seriesPosts = post.series
    ? all
        .filter((item) => item.series === post.series)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : []
  const hasSeries = Boolean(post.series && seriesPosts.length > 1)

  const date = formatDate(post.date)
  const updatedDate = post.updated ? formatDate(post.updated) : null
  const updated = updatedDate && updatedDate !== date ? updatedDate : null

  return (
    <div className="shell">
      <Link className="back-link" to="/posts/">
        <Icon name="arrow" /> 全部文章
      </Link>

      <div className="page-head article-head">
        <p className="eyebrow">
          {post.tags.map((tag) => `#${tag}`).join(' / ')}
          {post.series && ` / ${seriesName(post.series)}`}
        </p>
        <h1>{post.title}</h1>
        <p>{post.summary}</p>
        <div className="row-meta">
          <time dateTime={date}>{date}</time>
          <span>·</span>
          <span>{readingTime(post.raw)} min</span>
          {updated && (
            <>
              <span>·</span>
              <span>更新于 {updated}</span>
            </>
          )}
          {post.draft && (
            <>
              <span>·</span>
              <span className="draft-mark">草稿</span>
            </>
          )}
        </div>
      </div>

      <div className="article-layout">
        <article className="article-body" dangerouslySetInnerHTML={{ __html: post.html }} />

        <aside>
          <Toc items={post.toc} />

          {hasSeries && post.series && (
            <nav className="article-series" aria-label="本系列">
              <h2>{seriesName(post.series)}</h2>
              <ol>
                {seriesPosts.map((item) => (
                  <li key={item.slug} className={item.slug === post.slug ? 'is-current' : undefined}>
                    {item.slug === post.slug ? item.title : <Link to={`/posts/${item.slug}/`}>{item.title}</Link>}
                  </li>
                ))}
              </ol>
            </nav>
          )}
        </aside>
      </div>

      <div className="article-bottom">
        <span>
          {older && (
            <Link className="text-link" to={`/posts/${older.slug}/`}>
              <Icon name="arrow" /> {older.title}
            </Link>
          )}
        </span>
        <span>
          {newer && (
            <Link className="text-link" to={`/posts/${newer.slug}/`}>
              {newer.title} <Icon name="out" />
            </Link>
          )}
        </span>
      </div>
    </div>
  )
}

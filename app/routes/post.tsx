import type { MetaFunction } from 'react-router'
import { Link, useParams } from 'react-router'
import { DownloadNote } from '~/components/DownloadNote'
import { Icon } from '~/components/Icon'
import { Toc } from '~/components/Toc'
import { getPublishedPosts, type Post } from '~/lib/content'
import { postCategoryName } from '~/lib/post-categories'
import { readingTime } from '~/lib/reading-time'
import { pageMeta } from '~/lib/seo'
import { seriesName } from '~/lib/series'
import { SITE_AUTHOR, SITE_URL } from '~/lib/site'

/** 参考站的日期格式：October 20, 2026 */
const LONG_DATE = new Intl.DateTimeFormat('en', {
  month: 'long',
  day: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
})

function longDate(iso: string): string {
  return LONG_DATE.format(new Date(`${iso.slice(0, 10)}T00:00:00Z`))
}

function findPost(slug: string | undefined): Post {
  const post = getPublishedPosts().find((item) => item.slug === slug)
  if (!post) throw new Response('Not Found', { status: 404 })
  return post
}

export const meta: MetaFunction<{ slug: string }> = ({ params }) => {
  const post = findPost(params.slug)
  const pageUrl = new URL(`/posts/${post.slug}/`, SITE_URL).href
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

/**
 * 版式取自参考站 article()：
 * back-link → 页头（标签当 eyebrow）→ 两栏（article-body / article-toc）。
 * 参考站没有系列概念，系列导航放在 aside 里，不动正文的两栏结构。
 */
export default function PostRoute() {
  const { slug } = useParams()
  const post = findPost(slug)

  const all = getPublishedPosts()
  const seriesPosts = post.series
    ? all
        .filter((item) => item.series === post.series)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : []
  /** 单篇系列不值得占一栏，和系列页的判定保持一致 */
  const hasSeries = Boolean(post.series && seriesPosts.length > 1)

  const minutes = readingTime(post.raw)
  const updated = post.updated ? longDate(post.updated) : null

  return (
    <>
      <Link className="back-link" to="/posts/">
        <Icon name="arrow" /> All writing
      </Link>

      <header className="page-head article-head">
        <div className="eyebrow">WRITING</div>
        <h1>{post.title}</h1>
        <dl className="article-properties">
          <div>
            <dt>Category</dt>
            <dd><span className="post-category-label" data-category={post.category}>{postCategoryName(post.category)}</span></dd>
          </div>
          <div>
            <dt>Published At</dt>
            <dd><time dateTime={post.date.slice(0, 10)}>{longDate(post.date)}</time></dd>
          </div>
          <div>
            <dt>Summary</dt>
            <dd><p className="article-property-summary">{post.summary}</p></dd>
          </div>
        </dl>
      </header>

      <div className="article-layout">
        <div>
          <article className="article-body" dangerouslySetInnerHTML={{ __html: post.html }} />
          <div className="article-details-meta">
            <div className="row-meta">
              <span>{minutes} min read</span>
              {updated && <><span>·</span><span>Updated {updated}</span></>}
            </div>
            <div className="post-tags" aria-label="文章主题标签">
              {post.tags.map((tag) => (
                <Link key={tag} className="tag" to={`/posts/?tag=${encodeURIComponent(tag)}`}>
                  {tag}
                </Link>
              ))}
            </div>
          </div>
          <div className="article-bottom">
            <Link className="text-link" to="/posts/">
              <Icon name="arrow" /> Back to writing
            </Link>
            <Link className="text-link" to="/workshop/">
              Write something new <Icon name="out" />
            </Link>
          </div>
        </div>

        <Toc items={post.toc}>
          <DownloadNote post={post} />

          {hasSeries && post.series && (
            <div className="toc-group">
              <h2>IN THIS SERIES</h2>
              <p className="toc-series-name">{seriesName(post.series)}</p>
              {seriesPosts.map((item) =>
                item.slug === post.slug ? (
                  <span key={item.slug} className="is-current" aria-current="page">
                    {item.title}
                  </span>
                ) : (
                  <Link key={item.slug} to={`/posts/${item.slug}/`}>
                    {item.title}
                  </Link>
                ),
              )}
            </div>
          )}
        </Toc>
      </div>
    </>
  )
}

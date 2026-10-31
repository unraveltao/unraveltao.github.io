import { Fragment } from 'react'
import type { MetaFunction } from 'react-router'
import { Link, useParams } from 'react-router'
import { Toc } from '~/components/Toc'
import { getPublishedPosts, type Post } from '~/lib/content'
import { formatDate } from '~/lib/posts'
import { readingTime } from '~/lib/reading-time'
import { pageMeta } from '~/lib/seo'
import { seriesName } from '~/lib/series'
import { SITE_AUTHOR, SITE_URL } from '~/lib/site'
import styles from './post.module.css'

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
  /** 左栏只在真有系列导航时启用，必须和下面导航的渲染条件用同一个表达式，否则单篇系列会得到空左栏 */
  const hasSeries = Boolean(post.series && seriesPosts.length > 1)
  const seriesPosition = seriesPosts.findIndex((item) => item.slug === post.slug) + 1

  const date = formatDate(post.date)
  const updatedDate = post.updated ? formatDate(post.updated) : null
  const updated = updatedDate && updatedDate !== date ? updatedDate : null
  const minutes = readingTime(post.raw)

  return (
    <article>
      <div className={`${styles.grid} ${hasSeries ? styles.gridSeries : ''}`}>
        <div className={styles.main}>
          <header className={styles.header}>
            <h1 className={styles.title}>{post.title}</h1>
            <p className={`meta ${styles.meta}`}>
              <time dateTime={date}>{date}</time>
              {post.draft && (
                <>
                  <span className={styles.dot}>·</span>
                  <span className={styles.draft}>草稿</span>
                </>
              )}
              <span className={styles.dot}>·</span>
              <span>{minutes} min</span>
              {updated && (
                <>
                  <span className={styles.dot}>·</span>
                  <span>更新于 {updated}</span>
                </>
              )}
              {post.tags.map((tag) => (
                <Fragment key={tag}>
                  <span className={styles.dot}>·</span>
                  <Link className="tag" to={`/tags/${tag}/`}>
                    #{tag}
                  </Link>
                </Fragment>
              ))}
            </p>
            <p className={styles.summary}>{post.summary}</p>
          </header>

          <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />
        </div>

        {hasSeries && post.series && (
          <nav className={styles.seriesNav} aria-label="本系列">
            <p className="meta">
              本系列 {seriesPosition} / {seriesPosts.length} · {seriesName(post.series)}
            </p>
            <ul>
              {seriesPosts.map((item, i) => (
                <li key={item.slug} className={item.slug === post.slug ? styles.isCurrent : undefined}>
                  <span className={`meta ${styles.seriesIndex}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {item.slug === post.slug ? (
                    <span>{item.title}</span>
                  ) : (
                    <Link to={`/posts/${item.slug}/`}>{item.title}</Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        )}

        <nav className={styles.postNav} aria-label="上下篇">
          <div className={styles.postNavSide}>
            {older && (
              <Link to={`/posts/${older.slug}/`}>
                <span className="meta">← 上一篇</span>
                <span className={styles.postNavTitle}>{older.title}</span>
              </Link>
            )}
          </div>
          <div className={`${styles.postNavSide} ${styles.postNavSideRight}`}>
            {newer && (
              <Link to={`/posts/${newer.slug}/`}>
                <span className="meta">下一篇 →</span>
                <span className={styles.postNavTitle}>{newer.title}</span>
              </Link>
            )}
          </div>
        </nav>

        <div className={styles.aside}>
          <Toc items={post.toc} />
        </div>
      </div>
    </article>
  )
}

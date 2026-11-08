import type { MetaFunction } from 'react-router'
import { Link } from 'react-router'
import { getPublishedPosts } from '~/lib/content'
import { pageMeta } from '~/lib/seo'

export const meta: MetaFunction = () =>
  pageMeta({
    path: '/personal-os',
    title: 'Personal OS',
    description: '一套持续迭代的个人方法论：从长期方向到项目实践，再到每天可以完成的行动。',
  })

/** 从系列文章直接生成模块导航，新增章节不需要维护第二份清单。 */
export default function PersonalOs() {
  const posts = getPublishedPosts()
    .filter((post) => post.series === 'personal-os')
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  return (
    <>
      <header className="page-head">
        <div className="eyebrow">PERSONAL OS</div>
        <h1>把长期方向，落到每天的行动。</h1>
        <p>
          这里记录一套仍在实践和调整中的个人方法论。每个模块都从具体问题出发，说明当前做法、更新日期与尚待验证之处。
        </p>
      </header>

      {posts.length > 0 ? (
        <ol className="personal-os-list">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link to={`/posts/${post.slug}/`}>
                <span className="personal-os-order">{String(post.order ?? 0).padStart(2, '0')}</span>
                <span className="personal-os-copy">
                  <span className="personal-os-title">{post.title}</span>
                  <span className="personal-os-summary">{post.summary}</span>
                  <span className="personal-os-updated">
                    更新于 <time dateTime={(post.updated ?? post.date).slice(0, 10)}>{post.updated ?? post.date}</time>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <p>Personal OS 的第一个模块正在整理中。</p>
      )}
    </>
  )
}

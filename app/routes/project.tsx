import type { MetaFunction } from 'react-router'
import { Link, useParams } from 'react-router'
import { Icon } from '~/components/Icon'
import { getProjects, getPublishedPosts } from '~/lib/content'
import { statusLabel } from '~/lib/projects'
import { pageMeta } from '~/lib/seo'
import { SITE_AUTHOR } from '~/lib/site'

export const meta: MetaFunction<{ slug: string }> = ({ params }) => {
  const project = getProjects().find((item) => item.slug === params.slug)
  if (!project) return pageMeta({ path: `/projects/${params.slug ?? ''}`, title: 'Projects' })

  return pageMeta({
    path: `/projects/${project.slug}`,
    title: project.name,
    description: project.summary,
  })
}

/**
 * 项目正文与相关文章一起展示；关联来自 Post.project，避免再维护一份文章链接。
 */
export default function ProjectRoute() {
  const { slug } = useParams()
  const project = getProjects().find((item) => item.slug === slug)
  if (!project) throw new Response('Not Found', { status: 404 })
  const relatedPosts = getPublishedPosts().filter((post) => post.project === project.slug)

  return (
    <>
      <Link className="back-link" to="/projects/">
        <Icon name="arrow" /> 全部项目
      </Link>

      <header className="page-head">
        <div className="eyebrow">{statusLabel(project.status).toUpperCase()}</div>
        <h1>{project.name}</h1>
        <p>{project.summary}</p>
      </header>

      <div className="project-detail-grid">
        <div>
          <article className="article-body" dangerouslySetInnerHTML={{ __html: project.html }} />
          {relatedPosts.length > 0 && (
            <section className="article-body" aria-labelledby="related-writing">
              <h2 id="related-writing">相关写作</h2>
              <ul>
                {relatedPosts.map((post) => (
                  <li key={post.slug}>
                    <Link to={`/posts/${post.slug}/`}>{post.title}</Link>
                    <p>{post.summary}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <dl className="detail-info">
          <div>
            <dt>当前状态</dt>
            <dd>
              <span className="status">{statusLabel(project.status)}</span>
            </dd>
          </div>
          <div>
            <dt>技术栈</dt>
            <dd>
              {project.stack.map((item) => (
                <span className="tag" key={item}>
                  {item}
                </span>
              ))}
            </dd>
          </div>
          <div>
            <dt>作者</dt>
            <dd>{SITE_AUTHOR}</dd>
          </div>
          {/* 三个外链各自独立：缺哪个就不渲染哪一行，不拿本站页面去补位 */}
          {project.repo && (
            <div>
              <dt>项目源码</dt>
              <dd>
                <a className="button" href={project.repo} target="_blank" rel="noopener noreferrer">
                  查看仓库 <Icon name="out" />
                </a>
              </dd>
            </div>
          )}
          {project.docs && (
            <div>
              <dt>项目文档</dt>
              <dd>
                <a className="text-link" href={project.docs} target="_blank" rel="noopener noreferrer">
                  查看文档 <Icon name="out" />
                </a>
              </dd>
            </div>
          )}
          {project.demo && (
            <div>
              <dt>在线演示</dt>
              <dd>
                <a className="text-link" href={project.demo} target="_blank" rel="noopener noreferrer">
                  查看演示 <Icon name="out" />
                </a>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </>
  )
}

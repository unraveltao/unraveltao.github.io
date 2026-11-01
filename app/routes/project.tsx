import type { MetaFunction } from 'react-router'
import { Link, useParams } from 'react-router'
import { Icon } from '~/components/Icon'
import { ProjectArt } from '~/components/ProjectFeature'
import { getProjects } from '~/lib/content'
import { statusLabel } from '~/lib/projects'
import { pageMeta } from '~/lib/seo'

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
 * 版式取自参考站 projectDetail()：
 * back-link → 页头（kicker 用状态）→ project-detail-grid（左：封面 + 正文，右：dl 信息栏）。
 * 参考站的 details / next 两段由 frontmatter 提供，本站写在正文里，所以这里直接渲染 markdown。
 */
export default function ProjectRoute() {
  const { slug } = useParams()
  const project = getProjects().find((item) => item.slug === slug)
  if (!project) throw new Response('Not Found', { status: 404 })

  return (
    <>
      <Link className="back-link" to="/projects/">
        <Icon name="arrow" /> All projects
      </Link>

      <header className="page-head">
        <div className="eyebrow">{statusLabel(project.status).toUpperCase()}</div>
        <h1>{project.name}</h1>
        <p>{project.summary}</p>
      </header>

      <div className="project-detail-grid">
        <div>
          <ProjectArt slug={project.slug} />
          <article className="article-body" dangerouslySetInnerHTML={{ __html: project.html }} />
        </div>

        <dl className="detail-info">
          <div>
            <dt>Current chapter</dt>
            <dd>
              <span className="status">{statusLabel(project.status)}</span>
            </dd>
          </div>
          <div>
            <dt>Built around</dt>
            <dd>
              {project.stack.map((item) => (
                <span className="tag" key={item}>
                  {item}
                </span>
              ))}
            </dd>
          </div>
          <div>
            <dt>By</dt>
            <dd>unraveltao</dd>
          </div>
          {project.repo ? (
            <div>
              <dt>Explore the source</dt>
              <dd>
                <a className="button" href={project.repo} target="_blank" rel="noopener noreferrer">
                  View on GitHub <Icon name="out" />
                </a>
              </dd>
            </div>
          ) : (
            <div>
              <dt>Try the workflow</dt>
              <dd>
                <Link className="button" to="/workshop/">
                  Open the workshop <Icon name="arrow" />
                </Link>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </>
  )
}

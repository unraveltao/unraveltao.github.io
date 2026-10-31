import type { MetaFunction } from 'react-router'
import { Link, useParams } from 'react-router'
import { Icon } from '~/components/Icon'
import { ProjectArt } from '~/components/ProjectFeature'
import { getProjects } from '~/lib/content'
import { statusLabel } from '~/lib/projects'
import { pageMeta } from '~/lib/seo'

export const meta: MetaFunction<{ slug: string }> = ({ params }) => {
  const project = getProjects().find((item) => item.slug === params.slug)
  if (!project) return pageMeta({ path: `/projects/${params.slug ?? ''}`, title: '项目' })

  return pageMeta({
    path: `/projects/${project.slug}`,
    title: project.name,
    description: project.summary,
  })
}

export default function ProjectRoute() {
  const { slug } = useParams()
  const project = getProjects().find((item) => item.slug === slug)
  if (!project) throw new Response('Not Found', { status: 404 })

  return (
    <div className="shell">
      <Link className="back-link" to="/projects/">
        <Icon name="arrow" /> 全部项目
      </Link>

      <div className="page-head">
        <p className="eyebrow">{project.stack.join(' / ')}</p>
        <h1>{project.name}</h1>
        <p>{project.summary}</p>
      </div>

      <div className="project-detail-grid">
        <div>
          <ProjectArt slug={project.slug} />
          <div className="article-body" dangerouslySetInnerHTML={{ __html: project.html }} />
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
          {project.repo && (
            <div>
              <dt>源码</dt>
              <dd>
                <a className="button" href={project.repo} target="_blank" rel="noopener noreferrer">
                  在 GitHub 上查看 <Icon name="out" />
                </a>
              </dd>
            </div>
          )}
          {project.demo && (
            <div>
              <dt>演示</dt>
              <dd>
                <a className="button" href={project.demo} target="_blank" rel="noopener noreferrer">
                  打开 <Icon name="out" />
                </a>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  )
}

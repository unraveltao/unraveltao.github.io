import { Link } from 'react-router'
import type { Project } from '~/lib/content'
import { statusLabel } from '~/lib/projects'
import { Icon } from './Icon'

/**
 * 项目封面插画，取自参考站 projectArt()：
 * lattice 画一个歪着的窗口构图，其他项目落到 garden. 字样。
 */
function ProjectArt({ slug }: { slug: string }) {
  if (slug === 'lattice') {
    return (
      <div className="project-art" aria-hidden="true">
        <span className="art-label">LATTICE — INTERFACE STUDY</span>
        <div className="window-composition">
          <div className="mini-window window-main">
            <div className="window-bar">
              <i />
              <i />
              <i />
            </div>
            <div className="mini-body">
              <div className="mini-sidebar">
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className="mini-pane">
                <b>A place for your flow.</b>
                <div className="mini-lines">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          </div>
          <div className="mini-window window-widget">
            <div className="window-bar">
              <i />
              <i />
            </div>
            <div className="widget-inner">
              <Icon name="code" />
              <p>Small tools.</p>
              <small>More possibilities.</small>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="project-art" aria-hidden="true">
      <span className="art-label">A PERSONAL CORNER OF THE INTERNET</span>
      <div className="garden-cover">
        garden.
        <small>WRITE. BUILD. REPEAT.</small>
      </div>
    </div>
  )
}

export function ProjectFeature({ project }: { project: Project }) {
  return (
    <Link className="project-feature" to={`/projects/${project.slug}/`}>
      <ProjectArt slug={project.slug} />
      <div className="project-feature-info">
        <div className="project-title-row">
          <h3>{project.name}</h3>
          {project.status && statusLabel(project.status) && (
            <span className={`status status-${project.status}`}>{statusLabel(project.status)}</span>
          )}
        </div>
        {project.summary && <p>{project.summary}</p>}
        {project.stack && project.stack.length > 0 && (
          <div className="project-meta">
            {project.stack.slice(0, 2).map((item, index) => (
              <span key={item}>
                {index > 0 && ' / '}
                {item}
              </span>
            ))}
            <Icon name="out" />
          </div>
        )}
      </div>
    </Link>
  )
}

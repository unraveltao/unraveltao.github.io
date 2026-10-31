import { Link } from 'react-router'
import type { Project } from '~/lib/content'
import { statusLabel } from '~/lib/projects'
import { Icon } from './Icon'

/**
 * 项目封面插画。
 *
 * 原站按 slug 分支：lattice 画一个歪着的窗口构图，其他画 garden. 字样。
 * 这里保留同样的分支——加新项目时默认落到 garden-cover，不会缺图。
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
                <b>把流程放在一个地方。</b>
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
              <p>小工具。</p>
              <small>更多可能。</small>
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
          <span className="status">{statusLabel(project.status)}</span>
        </div>
        <p>{project.summary}</p>
        <div className="project-meta">
          {project.stack.slice(0, 2).map((item, index) => (
            <span key={item}>
              {index > 0 && ' / '}
              {item}
            </span>
          ))}
          <Icon name="out" />
        </div>
      </div>
    </Link>
  )
}

export { ProjectArt }

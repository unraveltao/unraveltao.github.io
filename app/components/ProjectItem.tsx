import { Link } from 'react-router'
import type { Project } from '~/lib/content'
import { statusLabel } from '~/lib/projects'
import styles from './ProjectItem.module.css'

export function ProjectItem({ project }: { project: Project }) {
  // 元信息行：状态 · 技术栈（最多 3 个）。与文章列表项同一个形状，只换内容。
  const metaLine = [statusLabel(project.status), ...project.stack.slice(0, 3)].join(' · ')

  return (
    <li className="post-item">
      <Link className={styles.link} to={`/projects/${project.slug}/`}>
        <span className={`meta post-item__date`}>{metaLine}</span>
        <span className="post-item__title">{project.name}</span>
        <p className="post-item__summary">{project.summary}</p>
      </Link>
    </li>
  )
}

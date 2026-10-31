import { ProjectItem } from '~/components/ProjectItem'
import { getProjects } from '~/lib/content'
import { pageMeta } from '~/lib/seo'
import styles from './projects.module.css'

export const meta = () =>
  pageMeta({
    path: '/projects',
    title: 'work',
    description: '做过的项目：解决什么问题、用了什么技术、现在什么状态。',
  })

export default function Projects() {
  const projects = getProjects()

  return (
    <div className="wrap">
      <header className={styles.pageHead}>
        <h1 className={styles.pageHeadTitle}>work</h1>
        <p className="meta">{projects.length} 个</p>
      </header>
      <ul className="post-list">
        {projects.map((project) => (
          <ProjectItem key={project.slug} project={project} />
        ))}
      </ul>
    </div>
  )
}

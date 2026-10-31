import { ProjectFeature } from '~/components/ProjectFeature'
import { getProjects } from '~/lib/content'
import { pageMeta } from '~/lib/seo'

export const meta = () =>
  pageMeta({
    path: '/projects',
    title: '项目',
    description: '做过的项目：解决什么问题、用了什么技术、现在什么状态。',
  })

export default function Projects() {
  const projects = getProjects()

  return (
    <div className="shell">
      <div className="page-head">
        <p className="eyebrow">THINGS I&rsquo;M MAKING</p>
        <h1>做过的东西。</h1>
        <p>每个项目都能回答三个问题：解决什么问题、用了什么技术、现在什么状态。</p>
      </div>

      <div className="project-grid">
        {projects.map((project) => (
          <ProjectFeature key={project.slug} project={project} />
        ))}
      </div>
    </div>
  )
}

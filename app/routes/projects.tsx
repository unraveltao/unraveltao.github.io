import { ProjectFeature } from '~/components/ProjectFeature'
import { getProjects } from '~/lib/content'
import { pageMeta } from '~/lib/seo'

export const meta = () =>
  pageMeta({
    path: '/projects',
    title: '项目',
    description:
      '从具体问题出发，记录项目的实现方式、当前状态和关键取舍。',
  })

/** 版式取自参考站 projects()：页头 + 两列 project-grid */
export default function Projects() {
  const projects = getProjects()

  return (
    <>
      <header className="page-head">
        <div className="eyebrow">项目与实践</div>
        <h1>做过什么，为什么这样做。</h1>
        <p>
          从具体问题出发，记录项目的实现方式、当前状态和关键取舍。
        </p>
      </header>

      <div className="project-grid">
        {projects.map((project) => (
          <ProjectFeature key={project.slug} project={project} />
        ))}
      </div>
    </>
  )
}

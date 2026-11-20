import { ProjectFeature } from '~/components/ProjectFeature'
import { getProjects } from '~/lib/content'
import { pageMeta } from '~/lib/seo'

export const meta = () =>
  pageMeta({
    path: '/projects',
    title: 'Projects',
    description: 'Selected projects, current work, and areas I am exploring.',
  })

/** 版式取自参考站 projects()：页头 + 两列 project-grid */
export default function Projects() {
  const projects = getProjects()

  return (
    <>
      <header className="page-head">
        <div className="eyebrow">PROJECTS & PRACTICE</div>
        <h1>Projects, practice, and directions I’m exploring.</h1>
        <p>
          This page focuses on confirmed details. Unverified descriptions, statuses, and repository links are left out.
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

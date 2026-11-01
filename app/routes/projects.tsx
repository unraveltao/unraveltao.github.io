import { ProjectFeature } from '~/components/ProjectFeature'
import { getProjects } from '~/lib/content'
import { pageMeta } from '~/lib/seo'

export const meta = () =>
  pageMeta({
    path: '/projects',
    title: 'Projects',
    description:
      'A few ongoing explorations in useful software, thoughtful tools, and learning by doing.',
  })

/** 版式取自参考站 projects()：页头 + 两列 project-grid */
export default function Projects() {
  const projects = getProjects()

  return (
    <>
      <header className="page-head">
        <div className="eyebrow">THINGS I’M MAKING</div>
        <h1>Built with curiosity.</h1>
        <p>
          A few ongoing explorations in useful software, thoughtful tools, and learning by doing.
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

import { ProjectFeature } from '~/components/ProjectFeature'
import { getProjects } from '~/lib/content'
import { pageMeta } from '~/lib/seo'

export const meta = () =>
  pageMeta({
    path: '/projects',
    title: '项目',
    description: '项目、实践与待探索方向；只展示已经确认的信息。',
  })

/** 版式取自参考站 projects()：页头 + 两列 project-grid */
export default function Projects() {
  const projects = getProjects()

  return (
    <>
      <header className="page-head">
        <div className="eyebrow">项目与实践</div>
        <h1>项目、实践与正在探索的方向。</h1>
        <p>
          已确认的信息会逐步补充；尚未确定的介绍、状态与仓库地址保持空白。
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

import type { MetaFunction } from 'react-router'
import { Fragment } from 'react'
import { useParams } from 'react-router'
import { getProjects } from '~/lib/content'
import { statusLabel } from '~/lib/projects'
import { pageMeta } from '~/lib/seo'
import styles from './project.module.css'

export const meta: MetaFunction<{ slug: string }> = ({ params }) => {
  const project = getProjects().find((item) => item.slug === params.slug)
  if (!project) return pageMeta({ path: `/projects/${params.slug ?? ''}`, title: 'work' })

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
    <article className={styles.project}>
      <header className={styles.header}>
        <h1 className={styles.title}>{project.name}</h1>
        <p className={`meta ${styles.meta}`}>
          <span>{statusLabel(project.status)}</span>
          {project.stack.map((item) => (
            <Fragment key={item}>
              <span className={styles.dot}>·</span>
              <span>{item}</span>
            </Fragment>
          ))}
          {project.repo && (
            <>
              <span className={styles.dot}>·</span>
              <a href={project.repo}>仓库</a>
            </>
          )}
          {project.demo && (
            <>
              <span className={styles.dot}>·</span>
              <a href={project.demo}>演示</a>
            </>
          )}
        </p>
        <p className={styles.summary}>{project.summary}</p>
      </header>

      <div className="prose" dangerouslySetInnerHTML={{ __html: project.html }} />
    </article>
  )
}

import type { MetaFunction } from 'react-router'
import { pageMeta } from '~/lib/seo'

export const meta: MetaFunction = () =>
  pageMeta({
    path: '/personal-os',
    title: 'Personal OS',
    description: 'A personal index for ideas, reflections, reusable methods, and ongoing project and learning logs.',
  })

const columns = [
  {
    name: 'Think',
    number: '01',
    description: 'Ideas, perspectives, and principles that shape how I understand problems and make decisions.',
  },
  {
    name: 'Review',
    number: '02',
    description: 'Reflections on real practice: what happened, what I learned, and what I may change.',
  },
  {
    name: 'Skill',
    number: '03',
    description: 'Reusable methods, workflows, and practical notes on tools.',
  },
  {
    name: 'Log',
    number: '04',
    description: 'Progress, decisions, and milestones across projects, learning, and experiments.',
  },
]

/** A four-column visual index; article curation remains a separate editorial step. */
export default function PersonalOs() {
  return (
    <>
      <header className="page-head">
        <div className="eyebrow">PERSONAL OS</div>
        <h1>Turn long-term direction into daily action.</h1>
        <p>
          Four columns for ideas and principles, reflections on practice, reusable methods, and
          progress across projects and learning.
        </p>
      </header>

      <section className="personal-os-grid" aria-label="Personal OS columns">
        {columns.map((column) => (
          <article className="personal-os-card" key={column.name}>
            <div className="personal-os-card-art" aria-hidden="true">
              <span className="personal-os-card-index">PERSONAL OS / {column.number}</span>
              <span className="personal-os-card-word">{column.name}</span>
            </div>
            <div className="personal-os-card-body">
              <h2>{column.name}</h2>
              <p>{column.description}</p>
            </div>
          </article>
        ))}
      </section>
    </>
  )
}

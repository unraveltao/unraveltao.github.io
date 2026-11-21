import type { MetaFunction } from 'react-router'
import { pageMeta } from '~/lib/seo'

export const meta: MetaFunction = () =>
  pageMeta({
    path: '/personal-os',
    title: 'Personal OS',
    description: 'A personal index for ideas, reviews, reusable skills, and ongoing logs.',
  })

const columns = [
  {
    name: 'Think',
    number: '01',
    description: '想法、观点与原则，记录我如何理解问题并作出判断。',
  },
  {
    name: 'Review',
    number: '02',
    description: '回看一段实践或阶段，整理实际结果、经验与调整。',
  },
  {
    name: 'Skill',
    number: '03',
    description: '沉淀可复用的方法、流程与工具实践。',
  },
  {
    name: 'Log',
    number: '04',
    description: '记录项目、学习与实验的推进过程、决策和阶段进展。',
  },
]

/** A four-column visual index; article curation remains a separate editorial step. */
export default function PersonalOs() {
  return (
    <>
      <header className="page-head">
        <div className="eyebrow">PERSONAL OS</div>
        <h1>把长期方向，落到每天的行动。</h1>
        <p>
          四个栏目分别收纳想法与原则、实践复盘、可复用方法，以及项目和学习过程记录。
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

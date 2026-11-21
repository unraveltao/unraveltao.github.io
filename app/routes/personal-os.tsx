import type { MetaFunction } from 'react-router'
import { Link } from 'react-router'
import { postCategoryName, POST_CATEGORIES } from '~/lib/post-categories'
import { pageMeta } from '~/lib/seo'

export const meta: MetaFunction = () =>
  pageMeta({
    path: '/personal-os',
    title: 'Personal OS',
    description: 'A personal index for thinking, reviews, reusable skills, and logs.',
  })

/** The four registered Post categories are the Personal OS entry points. */
export default function PersonalOs() {
  return (
    <>
      <header className="page-head">
        <div className="eyebrow">PERSONAL OS</div>
        <h1>Turn long-term direction into daily action.</h1>
        <p>Browse writing by the four kinds of work it records: thinking, reviewing, practicing, and logging.</p>
      </header>

      <nav className="personal-os-grid" aria-label="Personal OS categories">
        {POST_CATEGORIES.map((category) => (
          <Link
            className="personal-os-card"
            data-category={category.slug}
            key={category.slug}
            to={`/personal-os/${category.slug}/`}
          >
            <span className="personal-os-card-art" aria-hidden="true">
              <span className="personal-os-card-index">PERSONAL OS / {String(category.order).padStart(2, '0')}</span>
              <span className="personal-os-card-word">{postCategoryName(category.slug)}</span>
            </span>
            <div className="personal-os-card-body">
              <h2>{postCategoryName(category.slug)}</h2>
              <p>{category.description}</p>
              <span className="personal-os-card-action">查看相关文章 <span aria-hidden="true">↗</span></span>
            </div>
          </Link>
        ))}
      </nav>
    </>
  )
}

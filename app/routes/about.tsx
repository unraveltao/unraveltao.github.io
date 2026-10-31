import { getPage } from '~/lib/content'
import { pageMeta } from '~/lib/seo'

const page = getPage('about')

export const meta = () => pageMeta({ path: '/about', title: page.title, description: page.summary })

export default function About() {
  return (
    <div className="shell">
      <div className="page-head">
        <p className="eyebrow">ABOUT</p>
        <h1>{page.title}</h1>
        {page.summary && <p>{page.summary}</p>}
      </div>

      <div className="article-body" dangerouslySetInnerHTML={{ __html: page.html }} />
    </div>
  )
}

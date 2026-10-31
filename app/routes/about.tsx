import { getPage } from '~/lib/content'
import { pageMeta } from '~/lib/seo'
import styles from './about.module.css'

const page = getPage('about')

export const meta = () => pageMeta({ path: '/about', title: page.title, description: page.summary })

export default function About() {
  return (
    <div className="wrap">
      <header className={styles.pageHead}>
        <h1 className={styles.pageHeadTitle}>{page.title}</h1>
      </header>
      <div className="prose" dangerouslySetInnerHTML={{ __html: page.html }} />
    </div>
  )
}

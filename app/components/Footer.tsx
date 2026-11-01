import { Link } from 'react-router'
import { SITE_NAME, SITE_REPO } from '~/lib/site'
import { Icon } from './Icon'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer shell">
      <Link className="footer-brand" to="/">
        A little more curious. A little more capable.
      </Link>
      <div>
        <span>
          © {year} {SITE_NAME}
        </span>
        <a href={SITE_REPO} target="_blank" rel="me noopener noreferrer">
          <Icon name="github" className="icon--brand" />
          GitHub
        </a>
        <a href="/rss.xml">
          RSS <Icon name="arrow" />
        </a>
      </div>
    </footer>
  )
}

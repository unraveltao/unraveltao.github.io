import { Link } from 'react-router'
import { SITE_NAME, SITE_REPO } from '~/lib/site'
import { Icon } from './Icon'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer shell">
      <Link className="footer-brand" to="/">
        多好奇一点，多能干一点。
      </Link>
      <div>
        <span>
          © {year} {SITE_NAME}
        </span>
        <a href="/rss.xml">
          RSS <Icon name="arrow" />
        </a>
        <a href={SITE_REPO} target="_blank" rel="me noopener noreferrer">
          GitHub <Icon name="out" />
        </a>
      </div>
    </footer>
  )
}

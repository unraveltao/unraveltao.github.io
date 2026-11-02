import { Link, useLocation } from 'react-router'
import { SITE_NAME, SITE_REPO } from '~/lib/site'
import { Icon } from './Icon'
import { SearchDialog } from './SearchDialog'
import { ThemeMenu } from './ThemeMenu'

/**
 * 头部保留三个展示入口；辅助工具原地址继续可访问。
 * 参考站这里还有一个「Private garden」徽标，本站没有访问控制，换成 GitHub 图标链接。
 */

const ITEMS = [
  { href: '/', label: 'Home', exact: true },
  { href: '/posts/', label: 'Writing' },
  { href: '/projects/', label: 'Projects' },
]

export function Header() {
  const { pathname } = useLocation()

  const isActive = (item: (typeof ITEMS)[number]) =>
    item.exact ? pathname === '/' : pathname.startsWith(item.href)

  return (
    <header className="site-header shell">
      <Link className="brand" to="/" aria-label={`${SITE_NAME} home`}>
        <span className="monogram" aria-hidden="true">
          u<span>.</span>
        </span>
        <span className="brand-copy">
          {SITE_NAME}
          <span>PROJECTS & WRITING</span>
        </span>
      </Link>

      <nav className="main-nav" aria-label="Main navigation">
        {ITEMS.map((item) => (
          <Link key={item.href} to={item.href} aria-current={isActive(item) ? 'page' : undefined}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="header-actions">
        <SearchDialog />
        <ThemeMenu />
        <a
          className="icon-button"
          href={SITE_REPO}
          target="_blank"
          rel="me noopener noreferrer"
          aria-label="GitHub"
          title="GitHub"
        >
          <Icon name="github" className="icon--brand" />
        </a>
      </div>
    </header>
  )
}

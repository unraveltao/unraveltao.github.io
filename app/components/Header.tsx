import { Link, useLocation } from 'react-router'
import { SITE_NAME, SITE_REPO } from '~/lib/site'
import { Icon } from './Icon'
import { ThemeMenu } from './ThemeMenu'

/**
 * 头部：monogram + 站名 + 主导航 + 外观面板入口。
 *
 * 原站这里还有一个「Private garden」徽标和全局搜索按钮，两个都不搬：
 * 徽标对公开站是假信息，搜索在原站是跨文章+项目的弹窗，本站文章少，
 * 文章列表页自带筛选，再加一个入口只是重复。
 */

const ITEMS = [
  { href: '/posts/', label: '文章' },
  { href: '/projects/', label: '项目' },
  { href: '/tags/', label: '标签' },
  { href: '/about/', label: '关于' },
]

export function Header() {
  const { pathname } = useLocation()

  return (
    <header className="site-header shell">
      <Link className="brand" to="/" aria-label={`${SITE_NAME} 首页`}>
        <span className="monogram" aria-hidden="true">
          u<span>.</span>
        </span>
        <span className="brand-copy">
          {SITE_NAME}
          <span>ENGINEERING NOTES</span>
        </span>
      </Link>

      <nav className="main-nav" aria-label="主导航">
        {ITEMS.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            aria-current={pathname.startsWith(item.href) ? 'page' : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="header-actions">
        <ThemeMenu />
        <a className="private-badge" href={SITE_REPO} target="_blank" rel="me noopener noreferrer">
          <Icon name="out" />
          GitHub
        </a>
      </div>
    </header>
  )
}

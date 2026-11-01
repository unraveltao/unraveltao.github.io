import { useLayoutEffect, type ReactNode } from 'react'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from 'react-router'
import { Footer } from '~/components/Footer'
import { Header } from '~/components/Header'
import { Icon, IconSprite } from '~/components/Icon'
import { ThemeProvider } from '~/components/ThemeProvider'
import { SITE_NAME } from '~/lib/site'
import { resolveTheme, THEME_INIT } from '~/lib/theme'
import '~/styles/global.css'

/**
 * 内联脚本负责首屏主题（同步执行，避免闪白）。
 * 但 React hydration 会抹掉 <html> 上它不认识的属性，所以 App 里还要用
 * useLayoutEffect 补一次——那是在浏览器下一次绘制之前，用户看不到回退。
 */
const RESTORE_ON_MOUNT = () => {
  document.documentElement.dataset.theme = resolveTheme()
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    // suppressHydrationWarning：<head> 里的内联脚本在 hydration 之前就给 <html>
    // 加了 data-theme，React 对不上这个属性会报警并把它抹掉（主题因此回退到 Spring）
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {/* 全站固定的头部信息放在这里；随页面变化的 title/og 由各路由的 meta 导出提供 */}
        <link rel="alternate" type="application/rss+xml" title={SITE_NAME} href="/rss.xml" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="sitemap" href="/sitemap-index.xml" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:locale" content="zh_CN" />
        <meta name="twitter:card" content="summary_large_image" />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  useLayoutEffect(RESTORE_ON_MOUNT, [])

  return (
    <ThemeProvider>
      <IconSprite />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" className="shell" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </ThemeProvider>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  const notFound = isRouteErrorResponse(error) && error.status === 404

  return (
    <ThemeProvider>
      <IconSprite />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" className="shell" tabIndex={-1}>
        <div className="empty-state" style={{ marginTop: 60 }}>
          <h1>{notFound ? 'This path hasn’t grown yet.' : 'The garden needs a moment.'}</h1>
          <p>
            {notFound
              ? 'The page may have moved. There’s plenty to explore back at home.'
              : 'Something broke while rendering this page. Try again, or head back home.'}
          </p>
          <a className="button primary" href="/">
            Back to the garden <Icon name="arrow" />
          </a>
        </div>
      </main>
      <Footer />
    </ThemeProvider>
  )
}

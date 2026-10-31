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
import { Nav } from '~/components/Nav'
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
    // 加了 data-theme，React 对不上这个属性会报警并把它抹掉（主题因此回退到浅色）
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
    <>
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  const notFound = isRouteErrorResponse(error) && error.status === 404

  return (
    <div className="wrap notfound">
      <p className="meta">{notFound ? '404' : 'error'}</p>
      <h1 className="notfound__title">{notFound ? '这个地址没有内容' : '这一页出错了'}</h1>
      <p className="notfound__text">
        {notFound
          ? '可能是链接过期了，也可能是我改了 slug（不应该发生）。'
          : '构建期的校验应该拦住这种情况，如果没拦住，说明有地方绕过了它。'}
      </p>
      <p className="notfound__links meta">
        <a href="/">回首页</a>
        <span className="dot">·</span>
        <a href="/posts/">看全部文章</a>
      </p>
    </div>
  )
}

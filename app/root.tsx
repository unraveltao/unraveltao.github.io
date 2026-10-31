import type { ReactNode } from 'react'
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
import { IconSprite } from '~/components/Icon'
import { ThemeProvider } from '~/components/ThemeProvider'
import { SITE_NAME } from '~/lib/site'
import { THEME_INIT } from '~/lib/theme'
import '~/styles/global.css'

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
        {/* 主题要在第一帧之前定下来，否则会先画 Spring 再切走 */}
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
  return (
    <ThemeProvider>
      <IconSprite />
      <a className="skip-link" href="#main">
        跳到正文
      </a>
      <Header />
      <main id="main">
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
      <Header />
      <main id="main">
        <div className="shell notfound">
          <p className="eyebrow">{notFound ? '404' : 'ERROR'}</p>
          <h1>{notFound ? '这个地址没有内容' : '这一页出错了'}</h1>
          <p>
            {notFound
              ? '可能是链接过期了，也可能是我改了 slug（不应该发生）。'
              : '构建期的校验应该拦住这种情况，如果没拦住，说明有地方绕过了它。'}
          </p>
          <p className="notfound__links">
            <a href="/">回首页</a>
            <span>·</span>
            <a href="/posts/">看全部文章</a>
          </p>
        </div>
      </main>
      <Footer />
    </ThemeProvider>
  )
}

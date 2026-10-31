import { pageMeta } from '~/lib/seo'

export const meta = () => pageMeta({ path: '/404', title: '404', description: '这个地址没有内容。' })

export default function NotFound() {
  return (
    <div className="wrap notfound">
      <p className="meta">404</p>
      <h1 className="notfound__title">这个地址没有内容</h1>
      <p className="notfound__text">可能是链接过期了，也可能是我改了 slug（不应该发生）。</p>
      <p className="notfound__links meta">
        <a href="/">回首页</a>
        <span className="dot">·</span>
        <a href="/posts/">看全部文章</a>
      </p>
    </div>
  )
}

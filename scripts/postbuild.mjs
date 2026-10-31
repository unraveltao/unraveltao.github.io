#!/usr/bin/env node
/**
 * 构建后处理：把 React Router 的预渲染产物改成 GitHub Pages 能直接托管的形状。
 *
 * 做四件事：
 *   1. 把外链 CSS 内联进 HTML（沿用 docs/06 §1 的结论：全站 CSS 只有 ~8KB，
 *      内联省掉一次阻塞渲染的请求，Lighthouse 从 92 提到 99）
 *   2. 把 404/index.html 复制成根目录 404.html（GitHub Pages 只认这个路径）
 *   3. 生成 rss.xml
 *   4. 生成 sitemap-index.xml / sitemap-0.xml
 *
 * 路由清单不在这里重算：预渲染产物就是"已发布"的答案，
 * 本脚本只按 build/client 下真实存在的 HTML 推导 URL，避免出现第二份发布规则。
 */
import { readdir, readFile, writeFile, copyFile, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const CLIENT = join(ROOT, 'build', 'client')
const SITE = 'https://unraveltao.github.io'

const read = (path) => readFile(path, 'utf8')
const escapeXml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/** 递归收集 build/client 下的全部 HTML */
async function collectHtml(dir = CLIENT, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'assets' || entry.name === 'static') continue
      await collectHtml(full, out)
    } else if (entry.name.endsWith('.html')) {
      out.push(full)
    }
  }
  return out
}

/** index.html → 目录式 URL（带尾斜杠），404 页不进 sitemap */
function urlFor(file) {
  const rel = relative(CLIENT, file).split(sep).join('/')
  if (rel === 'index.html') return '/'
  if (rel === '404.html' || rel === '404/index.html') return null
  return `/${rel.replace(/\/index\.html$/, '/')}`
}

async function inlineCss(htmlFiles) {
  let inlined = 0
  const usedCss = new Set()

  for (const file of htmlFiles) {
    const html = await read(file)
    const tags = [...html.matchAll(/<link rel="stylesheet" href="(\/assets\/[^"]+\.css)"\s*\/?>/g)]
    if (tags.length === 0) continue

    let next = html
    for (const [tag, href] of tags) {
      const cssPath = join(CLIENT, href.replace(/^\//, ''))
      if (!existsSync(cssPath)) continue
      const css = await read(cssPath)
      usedCss.add(cssPath)
      next = next.replace(tag, `<style>${css}</style>`)
      inlined += 1
    }
    await writeFile(file, next)
  }

  // 注意：这里不删除 assets 下的 .css。内联解决的是首屏，但 React Router 的客户端
  // 导航会按路由 manifest 补 <link rel="stylesheet">，删掉文件就是 404（并且整页掉进
  // ErrorBoundary）。文件留着，首屏仍然零 CSS 请求。
  return inlined
}

async function writeRss(htmlFiles) {
  const posts = JSON.parse(await read(join(ROOT, '.velite', 'posts.json')))

  const published = posts
    .filter((post) => htmlFiles.includes(join(CLIENT, 'posts', post.slug, 'index.html')))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 20)

  const items = published
    .map((post) => {
      const url = `${SITE}/posts/${post.slug}/`
      const pubDate = new Date(post.date).toUTCString()
      return (
        `<item><title>${escapeXml(post.title)}</title>` +
        `<link>${url}</link>` +
        `<guid isPermaLink="true">${url}</guid>` +
        `<description>${escapeXml(post.summary)}</description>` +
        `<pubDate>${pubDate}</pubDate>` +
        `<content:encoded>${escapeXml(post.html)}</content:encoded>` +
        `</item>`
      )
    })
    .join('')

  const site = JSON.parse(await read(join(ROOT, 'app', 'lib', 'site.json')))

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">` +
    `<channel><title>${escapeXml(site.name)}</title>` +
    `<description>${escapeXml(site.description)}</description>` +
    `<link>${site.url}/</link><language>zh-CN</language>${items}</channel></rss>`

  await writeFile(join(CLIENT, 'rss.xml'), xml)
  return published.length
}

async function writeSitemap(htmlFiles) {
  const urls = htmlFiles
    .map(urlFor)
    .filter((url) => url !== null)
    .sort((a, b) => (a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b)))

  const body = urls.map((url) => `<url><loc>${SITE}${url}</loc></url>`).join('')
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`

  await writeFile(join(CLIENT, 'sitemap-0.xml'), xml)
  await writeFile(
    join(CLIENT, 'sitemap-index.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>` +
      `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
      `<sitemap><loc>${SITE}/sitemap-0.xml</loc></sitemap></sitemapindex>`,
  )
  return urls.length
}

async function main() {
  if (!existsSync(CLIENT)) {
    console.error('✗ 找不到 build/client，先跑 react-router build')
    process.exit(1)
  }

  const htmlFiles = await collectHtml()

  // GitHub Pages 的 404 只认根目录的 404.html
  const notFound = join(CLIENT, '404', 'index.html')
  if (existsSync(notFound)) await copyFile(notFound, join(CLIENT, '404.html'))

  const inlined = await inlineCss(htmlFiles)
  const rssCount = await writeRss(htmlFiles)
  const urlCount = await writeSitemap(htmlFiles)

  const size = (await stat(join(CLIENT, 'index.html'))).size
  console.log(
    `✓ 后处理完成：${htmlFiles.length} 个页面，内联 ${inlined} 段 CSS，` +
      `rss ${rssCount} 条，sitemap ${urlCount} 条，首页 ${(size / 1024).toFixed(1)}KB`,
  )
}

main().catch((error) => {
  console.error(`\n✗ 后处理失败：\n${error.message}\n`)
  process.exit(1)
})

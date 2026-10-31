#!/usr/bin/env node
/**
 * 本地预览 build/client。行为对齐 GitHub Pages：
 *   /posts/x/  → build/client/posts/x/index.html
 *   /posts/x   → 301 到 /posts/x/（目录式托管的行为）
 *   找不到的路径 → 404.html
 */
import { createServer } from 'node:http'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { join, extname, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../build/client', import.meta.url))
const PORT = Number(process.env.PORT ?? 4321)

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
}

createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost')
  const path = decodeURIComponent(url.pathname)

  if (!path.endsWith('/') && !extname(path) && existsSync(join(ROOT, path, 'index.html'))) {
    res.writeHead(301, { location: `${path}/` })
    res.end()
    return
  }

  const target = normalize(join(ROOT, path.endsWith('/') ? `${path}index.html` : path))
  const file = target.startsWith(ROOT) && existsSync(target) && statSync(target).isFile() ? target : null

  if (!file) {
    const fallback = join(ROOT, '404.html')
    res.writeHead(404, { 'content-type': TYPES['.html'] })
    if (existsSync(fallback)) createReadStream(fallback).pipe(res)
    else res.end('404')
    return
  }

  res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' })
  createReadStream(file).pipe(res)
}).listen(PORT, () => {
  console.log(`preview → http://localhost:${PORT}`)
})

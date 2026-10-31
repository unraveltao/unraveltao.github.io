import { resolve } from 'node:path'
import { reactRouter } from '@react-router/dev/vite'
import { build as buildContent } from 'velite'
import { defineConfig, type Plugin } from 'vite'

/**
 * 内容层在 dev 下要跟着文件变化重建，否则改一篇文章还得手动跑 velite。
 * 只在 serve 阶段挂载：build 时由 package.json 的 build 脚本显式跑一次，
 * 避免同一次构建里编译两遍（内容编译约 6s）。
 */
function velite(): Plugin {
  let timer: ReturnType<typeof setTimeout> | undefined

  return {
    name: 'velite',
    apply: 'serve',
    async buildStart() {
      // 构建期由 package.json 的 build 脚本显式跑一次；这里只管 dev
      if (process.env.NODE_ENV === 'production') return
      await buildContent()
    },
    configureServer(server) {
      const contentDir = resolve(process.cwd(), 'content')
      server.watcher.add(contentDir)
      server.watcher.on('all', (_event, file) => {
        if (!file.startsWith(contentDir)) return
        clearTimeout(timer)
        // 防抖：一次保存常触发多个事件，连续重建会互相踩输出目录
        timer = setTimeout(async () => {
          try {
            await buildContent()
            server.moduleGraph.invalidateAll()
            server.ws.send({ type: 'full-reload' })
          } catch (error) {
            server.config.logger.error(`[velite] ${(error as Error).message}`)
          }
        }, 150)
      })
    },
  }
}

export default defineConfig({
  plugins: [velite(), reactRouter()],
  resolve: {
    alias: {
      // 与 tsconfig 的 paths 保持一致；Vite 不读 tsconfig，两边都要写
      '~': resolve(process.cwd(), 'app'),
      // velite 的产物目录
      '#site': resolve(process.cwd(), '.velite'),
    },
  },
})

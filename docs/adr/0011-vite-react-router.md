# 用 Vite + React Router 7 换掉 Astro

站点改成 Vite + React 19 + React Router 7（framework mode，`ssr: true` + `prerender`）+ Velite 内容层，产物仍是纯静态 HTML。动因不是性能，是**维护者只熟 React**：这个仓库的长期风险不是"首屏多 100KB"，而是"每次想改点东西都要先跟 `.astro` 语法重新熟悉一遍"。熟悉度是真实的维护成本，G3（维护成本趋近于零）本来就该把它算进去。

**Considered Options**：

- **保留 Astro，只把组件换成 `.tsx`（islands）**：技术上最省——静态渲染 `.tsx` 不产生任何客户端 JS，只有 `client:*` 的组件才付运行时。但它没有解决动因：页面级逻辑（`getStaticPaths`、`Astro.props`、`<slot />`、scoped `<style>`）仍然是 Astro 的写法，改一个页面照样要查文档。**排除**。
- **Next.js + 静态导出**：能拿到 React，但静态导出会关掉 ISR / Server Actions / Route Handler，等于用更重的框架换更少的能力（这条在 ADR-0004 里已经被排除过一次，理由不变）。**排除**。
- **Vite + React Router 7 的 SPA 模式（`ssr: false`）**：配置最少，但每条路由只剩一个空 `<div id="root">`，`<title>`/OG 全站同一份，移动 4G 上 LCP 要等 JS 下载+解析+首帧。G2（招聘方五分钟内判断技术判断力）靠链接被点开，而链接的第一入口是社交预览卡。**排除**。

**Consequences**：

- **首屏 JS 从 0 变成约 122KB（gzip）**：React + react-dom + React Router 客户端运行时约 110KB，内容 JSON 约 7KB。这是本次决策唯一的硬代价，也是唯一一条"比原来差"的指标。旧的 15KB 预算作废，新预算见 `docs/04` §7.1。
- **换来了两件原来做不到的事**：逐篇 `<title>`/OG/JSON-LD 可以按路由 `meta` 导出，不再被 BaseLayout 的 Props 形状限制；客户端路由让站内跳转不再整页刷新。
- **内容层换成了 Velite**：`content.config.ts` 的三条 zod schema 平移到 `velite.config.ts`，`strict: true` 保证校验失败即构建失败。代价是**正文渲染成 HTML 字符串**（`dangerouslySetInnerHTML`），文章里暂时不能嵌 React 组件——这一条与 Astro 时代的能力相比是退步。真要嵌，下一步是把 `s.markdown()` 换成 `@mdx-js/rollup` 的真实模块（Velite 的 `s.mdx()` 走 `new Function` 求值，本来也支持不了 `import`）。
- **`src/` 整个目录消失**：`app/` 接管，路由从"文件即路由"变成 `app/routes.ts` 一张显式表。好处是 URL 表可以一眼看完，坏处是加页面要改两个地方（组件 + 表）。
- **尾斜杠的保证方式变了**：原来靠 `trailingSlash: 'always'` 一条配置，现在靠三处配合——`prerender` 清单（`react-router.config.ts`）、`postbuild.mjs` 把 `X.html` 改写成 `X/index.html`、`serve.mjs` 对缺斜杠的请求回 301。ADR-0006 的结论不变（URL 仍带尾斜杠），但这条不变式从"配置保证"降级成"三处约定保证"，漏一处的表现是线上 404。
- **Tailwind / shadcn 从"禁区"改成"有条件的上限"**：它们被记为下一轮视觉改造的目标天花板——允许评估，但必须先在 `docs/06` 立一条新决策，说清它解决哪个具体的视觉问题，且不得推翻 `AGENTS.md` §4.1 的六条。不能借"换成 React 了"顺手引入：2024 年那次 `Next + Tailwind + shadcn` 就是停在 `Hello World` 的。
- **要还的债**：逐篇 OG 图、`pnpm new` 脚手架、正文里嵌交互组件，三件都还在 `docs/04` §8 里躺着。

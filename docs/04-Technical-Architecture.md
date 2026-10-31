# 技术架构

> 这份文件回答"代码为什么这样组织、一次 build 到底发生了什么、哪里是坑"。
> 需求在 [02-Product-Requirements.md](./02-Product-Requirements.md)，选型理由在 [06-Decision-Log.md](./06-Decision-Log.md)。
> 最后更新：2026-11-01（ADR-0011：Astro → Vite + React Router）

## 1. 三条架构原则

1. **静态优先**。`react-router.config.ts` 里 `ssr: true` + `prerender`，构建期把每条路由渲染成真 HTML。没有服务端进程、没有数据库、没有运行时 API。
2. **构建期校验**。内容错误必须在 `pnpm build` 时炸掉，而不是上线后才发现。`velite.config.ts` 的 `strict: true` + `scripts/validate-content.mjs`，两道闸，失败即构建失败。
3. **客户端状态只有三样**：主题偏好（一个 `localStorage` 键）、TOC 滚动高亮、React Router 的导航状态。没有全局 store，没有数据请求。

## 2. 构建期与运行期

```
构建期（Node，一次性）                              运行期（浏览器）
─────────────────────────                          ────────────────────────
content/**/*.mdx                                   HTML（已内联 CSS）
   ↓ velite：glob + zod schema                        ↓
   ├─ 校验失败 ──> build 失败                         hydration（React 接管）
   ├─ html  ← markdown + shiki + 标题锚点             ├─ 主题切换
   ├─ toc   ← 标题树                                  ├─ TOC 滚动高亮
   └─ raw   ← 原文（阅读时长 / RSS）                   └─ 客户端路由（不整页刷新）
   ↓ .velite/*.json
scripts/validate-content.mjs（跨文件规则 3–6）
   ↓
react-router build
   ├─ prerender 每条路由 → build/client/**/index.html
   └─ 客户端 bundle → build/client/assets/
   ↓
scripts/postbuild.mjs
   ├─ CSS 内联进 HTML
   ├─ 404/index.html → 404.html
   └─ rss.xml + sitemap
   ↓
build/client/  →  GitHub Pages
```

运行期**没有数据请求**：所有页面数据在构建时就已固化进 HTML 与 bundle。首屏 JS 约 122KB（gzip），见 §7.1。

## 3. 目录结构

```
blog/
├── AGENTS.md                    # Agent 行为规范（改代码前必读）
├── README.md                    # 项目介绍、安装、运行
├── vite.config.ts               # velite 插件 + ~ / #site 别名
├── react-router.config.ts       # ssr / routeDiscovery / prerender 清单
├── velite.config.ts             # 三条 collection 的 zod schema（字段约束的唯一真源）
├── tsconfig.json                # strict + noUncheckedIndexedAccess
├── app/
│   ├── root.tsx                 # html/head/meta/OG/内联主题脚本/ErrorBoundary
│   ├── routes.ts                # 路由表（URL 表的唯一真源）
│   ├── routes/                  # 每个路由一个文件，模块导出 meta 提供 title/OG
│   ├── components/              # Nav / Footer / ThemeToggle / PostList / PostItem / ProjectItem / Toc
│   ├── lib/
│   │   ├── content.ts           # 读 velite 产物，类型 + 发布过滤的唯一入口
│   │   ├── publish.ts           # isPublished：构建期清单与页面共用同一条规则
│   │   ├── posts.ts             # 按年分组 / 标签计数 / 日期格式
│   │   ├── projects.ts          # 项目排序与状态文案
│   │   ├── seo.ts               # title / description / OG / canonical / JSON-LD
│   │   ├── theme.ts             # 主题读取、切换与内联脚本源码
│   │   ├── toc.ts               # 嵌套标题树 → 扁平列表
│   │   ├── reading-time.ts      # 中文 400 字/分，英文 200 词/分
│   │   ├── series.ts            # series.json 读取与回退
│   │   ├── site.json            # 站名/域名/定位句/描述/作者/邮箱/仓库（构建脚本也读它）
│   │   └── rehype-code-window.mjs  # 代码块套 macOS 窗口
│   └── styles/
│       ├── tokens.css           # 全部颜色/字号/间距变量
│       └── global.css           # reset + 元素样式 + 代码块 + 404
├── content/                     # 内容，不属于 app
│   ├── posts/<slug>/index.mdx   # 文章与图片同目录，目录名即 slug
│   ├── projects/<slug>/index.mdx # 项目，同上（没有 date）
│   ├── pages/about.mdx
│   └── series.json              # 系列 slug → 名称/描述
├── public/                      # 原样拷贝：favicon.svg / og.png / robots.txt
├── scripts/
│   ├── lib/content-rules.mjs    # 跨文件校验规则（纯函数，有回归测试）
│   ├── validate-content.mjs     # 上述规则的 CLI 外壳，build 的第二道闸
│   ├── postbuild.mjs            # 内联 CSS / 404.html / rss / sitemap
│   └── serve.mjs                # 本地预览 build/client，行为对齐 GitHub Pages
├── tests/                       # node:test 回归，见 tests/README.md
├── docs/                        # 本套文档 + adr/
└── .github/workflows/deploy.yml
```

**`content/` 与 `app/` 分开**：内容是可以被非程序员（或 agent）直接改的，代码不是。这个边界让"写文章"不需要理解 React。

## 4. 关键模块

| 模块 | 职责 | 注意 |
|---|---|---|
| `velite.config.ts` | 定义 posts / pages / projects 三条 collection 与字段约束 | 字段改这里，同时改 `docs/02` §5.3。`strict: true` 不能关 |
| `app/lib/content.ts` | velite 产物的类型门面 + 发布过滤 | 页面**不要**直接 import `#site/*.json`，否则发布规则会被复制到各处 |
| `app/lib/publish.ts` | `isPublished` 是**唯一**的发布判定 | 页面、`react-router.config.ts` 的预渲染清单、RSS 三处共用。dev 下恒为 true |
| `scripts/lib/content-rules.mjs` | 规则 3–6 的纯函数，返回 `Problem[]` 而非抛异常 | 一次报全部违规。**别用 `key in obj` 判系列是否存在**——原型链会让 `constructor` 通过 |
| `app/routes.ts` | 路由表 | 加页面要改两处（组件 + 这张表）。路径**不写尾斜杠**，产物是 `X/index.html` |
| `app/root.tsx` | head / meta / OG / 内联主题脚本 / ErrorBoundary | 主题脚本必须内联且同步执行；且要 `useLayoutEffect` 补一次，因为 hydration 会抹掉 `<html data-theme>` |
| `app/lib/seo.ts` | 所有 `<title>` / OG / canonical / JSON-LD | canonical 走 `meta` 不走 `links`：预渲染时 `links()` 不带参数，拿不到 params |
| `app/routes/post.tsx` | 文章页；≥1280px 系列文章为三栏 | 三栏靠 `post.module.css` 里的 `.gridSeries`，断点与 ADR-0010 一致 |
| `scripts/postbuild.mjs` | 产物后处理 | 见 §7.1：**不要**删 `assets/*.css`，客户端导航会 404 |
| `react-router.config.ts` | 预渲染清单 | `routeDiscovery: { mode: 'initial' }` 必须保留，静态托管没有 `/__manifest` 端点 |

## 5. 依赖策略

**运行时**：`react` · `react-dom` · `react-router` · `@react-router/node`（预渲染要它，别挪去 devDependencies）· `isbot`（React Router 的默认 server entry 用它）。

**构建期**：`vite` · `@react-router/dev` · `velite` · `@shikijs/rehype` · `rehype-slug` · `typescript`。

**不引入**：任何第三方主题、UI 框架、CSS-in-JS、动画库、图标库、日期库、状态管理。图标一律内联 SVG（全站不超过 4 个）。

Tailwind / shadcn 是**下一轮视觉改造的天花板**：允许评估，但必须先有视觉方案，不能借"已经换成 React 了"顺手引入（2024 年那次 `Next + Tailwind + shadcn` 停在 `Hello World`）。

新增依赖的判定顺序：
1. 能不能用平台能力（CSS / 原生 API / 框架内置）？
2. 能不能在构建期做完，不进入客户端？
3. 加上它，首屏 JS 预算还剩多少？

三问答不出来，就不加。

## 6. 样式架构

- `tokens.css` 是**唯一允许写色值的地方**；组件只消费 `var(--*)`。
- 深色主题靠 `:root[data-theme='dark']` 覆盖同名变量，**不是两套 class**。
- `global.css` 放 reset、元素样式（`prose`、`table`、`pre`）、代码块窗口、404；**组件与页面的布局样式放同名 `*.module.css`**，避免不同页面里同名的 `.page-head` 互相打架。
- CSS Modules 只做作用域，不做嵌套语法；选择器里引用全局类要显式 `:global(.tag)`。
- 全站 CSS 约 8KB，构建后处理时全量内联（见 §7.1）。

## 7. 构建与部署

```bash
pnpm install
pnpm dev       # http://localhost:5173（改 content/ 会自动重建内容层）
pnpm content   # 只跑 velite，重建 .velite/
pnpm validate  # 只跑跨文件校验，不构建
pnpm test      # node:test 回归，对象是 scripts/lib/content-rules.mjs
pnpm check     # react-router typegen + tsc --noEmit
pnpm build     # velite → validate → typegen → tsc → react-router build → postbuild
pnpm preview   # 预览 build/client（尾斜杠行为与 GitHub Pages 一致）
```

`build` 的顺序是有意的：内容层先跑（否则类型与数据都不存在），然后跨文件校验，最后才是类型检查与渲染。这样"内容错误"和"代码错误"在输出上是分开的——前者能直接定位到文件和字段。

**CI**（`.github/workflows/deploy.yml`）：push 到 `react-rewrite`（默认分支）→ pnpm 9 + Node 22 → `pnpm install --frozen-lockfile` → `pnpm build` → `actions/upload-pages-artifact@v3`（路径 `build/client`）→ `actions/deploy-pages@v4`。仓库 Settings → Pages → Source 必须选 **GitHub Actions**（一次性手动开启）。

**部署约束**：
- **默认分支是 `react-rewrite`**（2026-10-31 从 `main` 切过来）。`main` 仍然存在，但**不再触发部署**，也没有被删除——它停留在迁移前的 Astro 版本，作为回滚点。往 `main` 推任何东西都不会上线，这是一个容易踩的坑。
- 用户站点仓库名必须是 `unraveltao.github.io`，站点在根路径，**不需要 `base`**。改仓库名 = 改 URL 且没有跳转。
- GitHub Pages 是目录式托管：`/posts/x` 会 301 到 `/posts/x/`。React Router 的预渲染产物本来就是 `X/index.html`，正好对上；手写链接必须带尾斜杠。
- 将来绑自定义域名：加 `CNAME` + 改 `app/lib/site.json` 一处，代码结构不动。

**环境坑**：本机代理到 GitHub 会 502，`clone` / `push` 需绕过代理：

```bash
git -c http.proxy= -c https.proxy= push
```

### 7.1 三个刻意的取舍（不要撤销）

**① CSS 全量内联，但不删源文件**

`scripts/postbuild.mjs` 把每个页面引用的 `<link rel="stylesheet">` 换成 `<style>`。理由与 Astro 时代相同：唯一的 CSS 请求是全页最长的依赖链（943ms），样式到得比文档晚，第一次布局被推到 FCP 之后。11KB 内联后省掉一次往返，FCP 1.2s → 1.1s，TBT 归零。

**但 `assets/*.css` 不能删**：React Router 的客户端导航会按路由 manifest 补 `<link rel="stylesheet">`，删掉就是 404，而且整页掉进 ErrorBoundary。代价是首次站内跳转会多取一次已经内联过的 CSS（~8KB，可缓存）。

**② 首屏 JS 从 0 涨到约 122KB（gzip）**

拆开看：React + react-dom 约 43KB，React Router 客户端运行时约 67KB，内容 JSON 约 7KB，应用代码约 5KB。这是 ADR-0011 唯一的硬代价。

新预算（替代原来的 15KB）：**所有页面首屏 JS ≤ 130KB（gzip），实测 121.8KB**，Lighthouse 四项仍 ≥ 95，移动 4G 节流下 LCP < 1.2s。超了就说明有人往客户端塞了不该塞的东西——先查是不是引入了新依赖，不要先想着调 bundler。

**③ `routeDiscovery: { mode: 'initial' }`**

React Router 7 在 `ssr: true` 下默认是 `lazy`：客户端导航时去 GET `/__manifest` 补路由表。静态托管上没有这个端点，结果是**每次站内跳转都 404 并掉进 ErrorBoundary**。改成 `initial` 把路由表直接写进 HTML，代价是每页多几 KB。

## 8. 已知技术债

按优先级排列，详见 [05-Development-Roadmap.md](./05-Development-Roadmap.md)。

| # | 债 | 影响 | 现状 |
|---|---|---|---|
| 1 | 正文不能嵌 React 组件 | `s.markdown()` 产出 HTML 字符串，文章里只能用 Markdown | 与 Astro 时代相比是退步；要补就把 `s.markdown()` 换成 `@mdx-js/rollup` 的真实模块 |
| 2 | 首屏 JS 122KB | 比 Astro 的 0 多两个数量级 | 已记入 ADR-0011 的代价；预算见 §7.1 |
| 3 | 无 lint / 无 format | 格式无约束 | `tsc --noEmit` 已进 `build`；prettier 仍未装 |
| 4 | OG 图是单张静态图 | 所有文章共用 `public/og.png`，不是逐篇生成 | 文档写"构建期生成 1200×630"，未实现 |
| 5 | 无 `pnpm new` 脚手架 | 新文章手写 frontmatter，容易漏字段 | 文档提到但脚本不存在 |
| 6 | 校验脚本只认六个标量字段 | 手写 YAML 解析，`order: "1"` 这类变体会报错而非兼容 | 刻意为之：宁可不兼容，也不静默放过 |

## 9. 扩展指引

| 想做什么 | 改哪里 | 别忘了 |
|---|---|---|
| 加 frontmatter 字段 | `velite.config.ts` → `app/lib/content.ts` 的类型 → 使用它的页面 | 更新 `docs/02` §5.3 表格 |
| 加一个路由 | `app/routes/` 新建组件 + `app/routes.ts` 登记 + `react-router.config.ts` 的 `prerender` | 更新 `docs/02` §2 路由表 |
| 加一个项目 | `content/projects/<slug>/index.mdx` | 字段见 `docs/02` §5.7；不进 RSS、不进标签 |
| 加一个组件 | `app/components/`，PascalCase + 同名 module.css | 先确认设计系统里有这个组件的规格，没有就先补 `docs/03` |
| 改视觉 | `app/styles/tokens.css` 或对应 module.css | 同步 `docs/03`；不要引入色块/阴影 |
| 加依赖 | `package.json` | 先过 §5 的三问；在 `docs/06` 记一条决策 |

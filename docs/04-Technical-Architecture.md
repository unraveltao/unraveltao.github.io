# 技术架构

> 这份文件回答"代码为什么这样组织、一次 build 到底发生了什么、哪里是坑"。
> 需求在 [02-Product-Requirements.md](./02-Product-Requirements.md)，选型理由在 [06-Decision-Log.md](./06-Decision-Log.md)。
> 最后更新：2026-10-31

## 1. 三条架构原则

1. **静态优先**。`output: 'static'`，产物只有 HTML/CSS 和极少量内联 JS。没有服务端进程、没有数据库、没有运行时 API。
2. **构建期校验**。内容错误必须在 `pnpm build` 时炸掉，而不是上线后才发现。校验失败即构建失败。
3. **客户端零状态**。唯一的运行时状态是主题偏好（一个 `localStorage` 键）和 TOC 滚动高亮。没有框架、没有 hydration 岛、没有 router。

## 2. 构建期与运行期

```
构建期（Node，一次性）                        运行期（浏览器）
─────────────────────────                    ────────────────────────
content/**/*.mdx                             HTML（已内联 CSS）
   ↓ glob loader                              ↓
zod schema 校验  ──失败──> build 失败         内联主题脚本（读 localStorage）
   ↓ 通过                                     ↓
过滤 draft / 未来日期                          TOC 滚动高亮（IntersectionObserver）
   ↓
.astro 页面 + RSS + sitemap
   ↓
dist/  →  GitHub Pages
```

运行期**没有网络请求、没有 JS chunk**。所有页面数据在构建时就已固化进 HTML。

## 3. 目录结构

```
blog/
├── AGENTS.md                    # Agent 行为规范（改代码前必读）
├── README.md                    # 项目介绍、安装、运行
├── astro.config.mjs             # site / trailingSlash / inlineStylesheets / shiki
├── package.json                 # 只有 dev / build / preview
├── tsconfig.json                # 继承 astro/tsconfigs/strict
├── content/                     # 内容，不属于 src
│   ├── posts/<slug>/index.mdx   # 文章与图片同目录，目录名即 slug
│   ├── projects/<slug>/index.mdx # 项目，同上（没有 date）
│   ├── pages/about.mdx
│   └── series.json              # 系列 slug → 名称/描述
├── public/                      # 原样拷贝：favicon.svg / og.png / robots.txt
├── src/
│   ├── content.config.ts        # zod schema（字段约束的唯一真源）
│   ├── styles/
│   │   ├── tokens.css           # 全部颜色/字号/间距变量
│   │   └── global.css           # 元素样式 + 组件样式
│   ├── layouts/
│   │   ├── BaseLayout.astro     # html/head/meta/OG/主题脚本
│   │   └── PostLayout.astro     # 文章页骨架
│   ├── components/
│   │   ├── Nav.astro  Footer.astro  ThemeToggle.astro
│   │   ├── PostList.astro  PostItem.astro
│   │   └── Toc.astro  TagList.astro
│   ├── lib/
│   │   ├── posts.ts             # isPublished / 排序 / 按年分组 / 标签计数 / 日期格式
│   │   ├── projects.ts          # 项目排序与状态文案
│   │   ├── reading-time.ts      # 中文 400 字/分，英文 200 词/分
│   │   ├── series.ts            # series.json 读取与回退
│   │   ├── site.ts              # 站名/tagline/描述/作者/邮箱/仓库
│   │   └── rehype-code-window.mjs  # 代码块套 macOS 窗口
│   └── pages/                   # 路由即文件
│       ├── index.astro  about.astro  404.astro
│       ├── posts/index.astro  posts/[...slug].astro
│       ├── tags/index.astro   tags/[tag].astro
│       ├── series/[series].astro
│       ├── projects/index.astro   projects/[slug].astro
│       └── rss.xml.ts
├── tests/                       # 见 tests/README.md（当前只有约定，无 runner）
├── docs/                        # 本套文档 + adr/
└── .github/workflows/deploy.yml
```

**`content/` 与 `src/` 分开**：内容是可以被非程序员（或 agent）直接改的，代码不是。这个边界让"写文章"不需要理解 Astro。

## 4. 关键模块

| 模块 | 职责 | 注意 |
|---|---|---|
| `src/content.config.ts` | 定义 posts / pages 两个 collection 与字段约束 | 字段改这里，同时改 `docs/02` §5.3 |
| `src/lib/posts.ts` | `isPublished` 是**唯一**的发布判定 | 草稿/未来日期的过滤只在这里发生，别在页面里重复实现 |
| `src/lib/projects.ts` | 项目排序（`order` 缺省时按 `name`）与 `status` → 中文文案 | 文案映射不要散落在页面里 |
| `src/lib/series.ts` | 读 `series.json`，缺失时回退成 slug | 回退意味着**系列名拼错不会失败**，只会显示成 slug（见 §8 技术债） |
| `src/lib/rehype-code-window.mjs` | 把 `<pre>` 包成窗口外壳 | 与 `global.css` 里的 `.code-window` 样式强耦合 |
| `src/layouts/BaseLayout.astro` | head / meta / OG / 内联主题脚本 | 主题脚本必须内联且同步执行，否则首屏闪白 |
| `astro.config.mjs` | 站点 URL、尾斜杠、CSS 内联、shiki 主题 | MDX 不继承 `markdown.rehypePlugins`，必须给 `mdx()` 再传一次 |

## 5. 依赖策略

**只有官方集成**：`astro` · `@astrojs/mdx` · `@astrojs/sitemap` · `@astrojs/rss`。`zod` 与 `shiki` 随 Astro 提供。

**不引入**：任何第三方主题、UI 框架、CSS-in-JS、动画库、图标库、日期库、状态管理。图标一律内联 SVG（全站不超过 4 个）。

新增依赖的判定顺序：
1. 能不能用平台能力（CSS / 原生 API / Astro 内置）？
2. 能不能在构建期做完，不进入客户端？
3. 加上它，首屏 JS 预算还剩多少？

三问答不出来，就不加。

## 6. 样式架构

- `tokens.css` 是**唯一允许写色值的地方**；组件只消费 `var(--*)`。
- 深色主题靠 `:root[data-theme='dark']` 覆盖同名变量，**不是两套 class**。
- `global.css` 按"元素 → 布局 → 组件"顺序组织；`.astro` 组件内的 `<style>` 只写该组件独有的布局，不写颜色。
- 全站 CSS ~8KB，构建时全量内联（见 §7）。

## 7. 构建与部署

```bash
pnpm install
pnpm dev       # http://localhost:4321
pnpm build     # 输出 dist/，18 个页面 + rss.xml + sitemap-index.xml
pnpm preview   # 本地预览 dist/
```

**CI**（`.github/workflows/deploy.yml`）：push 到 `main` → `withastro/action@v3`（Node 22 / pnpm 9）构建 → `actions/deploy-pages@v4` 发布。仓库 Settings → Pages → Source 必须选 **GitHub Actions**（一次性手动开启）。

**部署约束**：
- 用户站点仓库名必须是 `unraveltao.github.io`，站点在根路径，**不需要 `base`**。改仓库名 = 改 URL 且没有跳转。
- GitHub Pages 是目录式托管，`/posts/x` 会 301 到 `/posts/x/`，所以 `trailingSlash: 'always'`。
- 将来绑自定义域名：加 `CNAME` + 改 `site` 一处，代码结构不动。

**环境坑**：本机代理到 GitHub 会 502，`clone` / `push` 需绕过代理：

```bash
git -c http.proxy= -c https.proxy= push
```

### 7.1 两个刻意的取舍（不要撤销）

这两个改动看起来像反模式，但都有实测数据支撑。**没有新的 Lighthouse 数据之前，不要改回去。**

**① CSS 全量内联**（`build.inlineStylesheets: 'always'`）

改之前 Lighthouse 只有 92：唯一的 CSS 请求是全页最长的依赖链（943ms），样式到得比文档晚，第一次布局被推到 FCP 之后，变成 330ms 的阻塞时间。11KB 内联后省掉一次往返，FCP 1.2s → 1.1s，TBT 归零。

代价：每页 HTML 多 7.5KB（gzip），且 CSS 不再跨页缓存——但 GitHub Pages 的 `Cache-Control` 本来只有 10 分钟，没什么可失去的。

**② 删掉 `text-rendering: optimizeLegibility`**

这是给 Safari 5 时代准备的字距优化开关，在 Blink 里会让每段文字都走一遍 kerning/ligature 解析，是纯负担。删掉后排版没有任何肉眼可见变化。

**已知噪声**：文章页 TBT 在 0–250ms 之间跳动，因为「样式 + 布局」那一次长任务（~200ms，4 倍 CPU 节流下）正好落在 FCP 附近，落在后面就算阻塞、落在前面就不算。多跑几次的中位数是 0。这个长任务的绝对耗时主要来自 CJK 字体回退（无 webfont，全靠系统字体），不是 DOM 复杂度——页面只有 266 个元素。用 `content-visibility` 压过，实测没有改善，还带来锚点跳转和 Ctrl+F 的风险，所以没上。

## 8. 已知技术债

按优先级排列，详见 [05-Development-Roadmap.md](./05-Development-Roadmap.md)。

| # | 债 | 影响 | 现状 |
|---|---|---|---|
| 1 | 跨文件内容校验缺失 | `order` 重复、`featured` 超一篇、`series` 拼错都**不会**让构建失败 | 文档承诺 8 条，实际 schema 覆盖 4 条 |
| 2 | **draft 在 dev 也不可见** | 文档说"`dev` 可见并带角标"，实际 `isPublished()` 与 `getProjects()` 都无条件过滤 draft | 与 `docs/02` §6 不符；要么改代码，要么改文档 |
| 3 | 无 typecheck / lint | `.astro` 与 `.ts` 的类型错误只能靠编辑器发现 | `@astrojs/check`、`prettier` 未安装 |
| 4 | 无测试 | 内容校验规则没有回归保护 | `tests/` 只有约定文档 |
| 5 | OG 图是单张静态图 | 所有文章共用 `public/og.png`，不是逐篇生成；**连带 `titleEn` / `summaryEn` 不生效** | 文档写"构建期生成 1200×630"，未实现 |
| 6 | 无 `pnpm new` 脚手架 | 新文章手写 frontmatter，容易漏字段 | 文档提到但脚本不存在 |

## 9. 扩展指引

| 想做什么 | 改哪里 | 别忘了 |
|---|---|---|
| 加 frontmatter 字段 | `src/content.config.ts` → 使用它的页面 | 更新 `docs/02` §5.3 表格 |
| 加一个路由 | `src/pages/` 下新建文件 | 更新 `docs/02` §2 路由表 + sitemap 自动包含 |
| 加一个项目 | `content/projects/<slug>/index.mdx` | 字段见 `docs/02` §5.7；不进 RSS、不进标签 |
| 加一个组件 | `src/components/`，PascalCase | 先确认设计系统里有这个组件的规格，没有就先补 `docs/03` |
| 改视觉 | `src/styles/tokens.css` 或 `global.css` | 同步 `docs/03`；不要引入色块/阴影 |
| 加依赖 | `package.json` | 先过 §5 的三问；在 `docs/06` 记一条决策 |

# Blog 设计文档

> 状态：设计已定稿，未开始实现。
> 最后更新：2026-10-26

## 1. 一句话

一个**以工程叙事为主的静态个人博客**：用 MDX 写、commit 即发布、零后端、零卡片、单一强调色，把 `lattice` 这类项目的设计取舍讲清楚。

**读者**：同行（看设计取舍）与招聘方（五分钟内判断技术判断力）。
**成功的定义**：三个月后还有新文章，且每篇都有一个可被引用的结论。

## 2. 目标与非目标

| 要做 | 明确不做（v1） |
|---|---|
| 文章列表 / 详情 / 标签 / 系列 | 评论 |
| RSS 全文、sitemap、OG 图、JSON-LD | 站内搜索 |
| 浅色 + 深色主题 | 阅读量统计 |
| 构建期内容校验 | 多作者 / 在线后台 |
| 手机端可读、可键盘操作 | 邮件订阅 / 全文双语 / 主题定制 |

非目标是**有意不做**，不是"以后再说"。真要加，顺序是：统计 → 搜索 → 评论。

## 3. 决策索引

| # | 决策 | 文档 |
|---|---|---|
| 0001 | 定位：工程叙事优先，纯教程不进主线 | [adr/0001](./adr/0001-blog-positioning.md) |
| 0002 | 内容以 MDX 存仓库，commit 即发布，拒绝 CMS | [adr/0002](./adr/0002-mdx-in-repo.md) |
| 0003 | 视觉延续 Profile README 的身份语言 | [adr/0003](./adr/0003-visual-identity.md) |
| 0004 | Astro 静态输出，不用 Next.js | [adr/0004](./adr/0004-astro-static.md) |
| 0005 | 只有一种内容类型：Post | [adr/0005](./adr/0005-post-only-content-model.md) |
| 0006 | 部署到 GitHub Pages，仓库名即站点域名 | [adr/0006](./adr/0006-github-pages.md) |

配套文档：
[信息架构](./information-architecture.md) · [内容模型](./content-model.md) · [设计系统](./design-system.md) · [术语表](../GLOSSARY.md)

## 4. 技术架构

**Astro 5 + Content Collections + MDX，`output: 'static'`。** 构建产物是纯 HTML/CSS + 一个主题切换脚本，没有服务端进程，没有数据库。

### 4.1 目录结构

```
blog/
├── astro.config.mjs
├── package.json
├── tsconfig.json              # strict: true
├── content/
│   ├── posts/<slug>/index.mdx # 文章与图片同目录
│   ├── pages/about.mdx
│   └── series.json            # 系列 slug → 中文名/描述
├── public/
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── content.config.ts      # zod schema + 校验
│   ├── styles/
│   │   ├── tokens.css         # 全部颜色/字号/间距变量
│   │   └── global.css
│   ├── layouts/
│   │   ├── BaseLayout.astro   # html/head/meta/主题脚本
│   │   └── PostLayout.astro   # 文章页骨架
│   ├── components/
│   │   ├── Nav.astro  Footer.astro  ThemeToggle.astro
│   │   ├── PostList.astro  PostItem.astro
│   │   └── Toc.astro  TagList.astro
│   ├── lib/
│   │   ├── posts.ts           # Published 过滤 + 排序 + 分组
│   │   ├── reading-time.ts    # 中文 400 字/分，英文 200 词/分
│   │   └── series.ts
│   └── pages/
│       ├── index.astro  about.astro  404.astro
│       ├── posts/index.astro  posts/[...slug].astro
│       ├── tags/index.astro   tags/[tag].astro
│       ├── series/[series].astro
│       └── rss.xml.ts
└── docs/
```

### 4.2 依赖清单（只有官方集成）

`astro` · `@astrojs/mdx` · `@astrojs/sitemap` · `@astrojs/rss` · `zod`（随 Astro 提供）· `shiki`（内置高亮）
开发期：`@astrojs/check` · `prettier` + `prettier-plugin-astro` · `typescript`

**不引入**：任何第三方主题、UI 框架、CSS-in-JS、动画库、图标库。图标一律内联 SVG（全站不超过 4 个）。

### 4.3 构建流水线

```
mdx 文件
  → zod schema 校验（单文件规则）
  → 跨文件校验脚本（order 重复 / featured 超一篇 / slug 冲突 / series 存在性）
  → 过滤 Draft 与未来日期
  → 生成页面 + RSS + sitemap + OG 图
  → 部署到 Cloudflare Pages
```

**校验失败即构建失败**，不允许"警告但继续"。

### 4.4 部署

- **GitHub Pages 用户站点**：仓库名必须是 `unraveltao.github.io`，站点在根路径，`site` 已配好，**不需要 `base`**。
- `.github/workflows/deploy.yml`：push 到 `main` → `withastro/action` 构建 → `actions/deploy-pages` 发布。
- 仓库 Settings → Pages → Source 选 **GitHub Actions**（一次性手动开启）。
- 已知约束：本机代理到 GitHub 会 502，`clone` / `push` 要绕过代理：`git -c http.proxy= -c https.proxy= push`。
- 将来绑自定义域名：加 CNAME + 改 `site` 一处，仓库名不再影响 URL。

## 5. 内容模型（摘要）

只有 **Post** 一个实体。关键字段：`title` `summary` `date` `tags` `series` + `order` `featured` `draft`。
`summary` 必填且 20–80 字，同时充当列表摘要与 `meta description`。
Series 不是实体，只是两个字段；Project 退化为一个字符串字段。
完整字段表、zod schema 与 8 条校验规则见 [content-model.md](./content-model.md)。

## 6. 信息架构（摘要）

```
/                    首页：身份 + 精选 1 篇 + 最近 10 篇
/posts               全部文章，按年分组
/posts/[slug]        文章页（含 TOC、上下篇、系列导航）
/tags  /tags/[tag]   标签索引与详情
/series/[series]     系列页，有序篇目
/about               关于
/rss.xml  /sitemap-index.xml  /404
```

URL 不变式：带尾斜杠、无日期、slug 全小写且**发布后永不修改**、中文不进 URL。
页面组成与 SEO / JSON-LD / RSS 规格见 [information-architecture.md](./information-architecture.md)。

## 7. 设计与体验

**纸白 + `#0F6E56` + 等宽元信息 + 直角 + 零阴影。** 文字承担全部层级，强调色只给可点击的东西和关键结论。

```
文章页（≥1200px）
┌────────────────────────────────────────────┐
│ 站名                    writing  tags  about│  ← 64px，滚动后才出现下边框
├────────────────────────────────────────────┤
│                                             │
│  在 Tauri 里把状态机拆出来           ┌──────┐│
│  2026-11-02 · 12 min · #tauri        │ 目录 ││
│  一句话导语，--ink-600               │ 01…  ││
│  ─────────────────────────────       └──────┘│
│  正文 680px，17px / 1.75                     │
│                                             │
│  ← 上一篇                    下一篇 →        │
├────────────────────────────────────────────┤
│ © 2026 · rss · github · mail                │
└────────────────────────────────────────────┘
```

关键约束（完整规范见 [design-system.md](./design-system.md)）：

- 正文 17px / 行高 1.75 / 行宽 680px（中文约 40 字一行）
- 深色主题下 accent 换成 `#4EC3A3`——`#0F6E56` 在深底上只有 3.05:1，正文不达 AA
- 标签是纯文字 `#tag`，**不做胶囊**；列表项之间不加分隔线，靠留白
- 中文不用斜体；标题不用两端对齐；动效只动 opacity/transform，160ms
- 焦点环必须是 `2px solid accent`，禁止 `outline: none`

## 8. 性能与质量预算

| 指标 | 上限 |
|---|---|
| 首屏 JS（gzip） | ≤ 15KB（只有主题切换 + TOC 高亮） |
| 首页 HTML（gzip） | ≤ 60KB |
| LCP（4G / 中端机） | < 1.2s |
| CLS | < 0.02 |
| 字体下载 | Latin 子集 ≤ 60KB，CJK **零下载**（走系统字体） |
| 正文单图 | ≤ 200KB |
| Lighthouse | 文章页四项均 ≥ 95 |

**一篇 Post 的完成定义**：构建通过 → 375px 无横向滚动 → 键盘可走完全流程 → OG 图渲染正确 → RSS 含全文 → Lighthouse 达标。

### 8.1 实测（2026-10-26，线上 `unraveltao.github.io`）

| 页面 / 模式 | Perf | A11y | Best Practices | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| 文章页 · 移动（4G 节流） | 99 | 100 | 100 | 100 | 1.2s | 130ms | 0 |
| 文章页 · 桌面 | 100 | 100 | 100 | 100 | 0.3s | 0ms | 0 |
| `/tags/` · 移动 | 100 | 100 | 100 | 100 | 0.9s | 0ms | 0 |

全站 **0 个 script 请求**、2 个请求、8KiB 总量（gzip）。首屏 JS 预算是 15KB，实际是 0——主题切换和 TOC 高亮都是内联脚本，不产生请求。

两个为了达标做过的改动，记在这里免得以后被「优化」回去：

1. **CSS 全量内联**（`build.inlineStylesheets: 'always'`）。改之前 Lighthouse 只有 92：唯一的 CSS 请求是全页最长的依赖链（943ms），样式到得比文档晚，第一次布局被推到 FCP 之后，变成 330ms 的阻塞时间。11KB 内联后省掉一次往返，FCP 1.2s → 1.1s，TBT 归零。代价是每页 HTML 多 7.5KB（gzip），且 CSS 不再跨页缓存——但 GitHub Pages 的 `Cache-Control` 本来只有 10 分钟，没什么可失去的。
2. **删掉 `text-rendering: optimizeLegibility`**。这是给 Safari 5 时代准备的字距优化开关，在 Blink 里会让每段文字都走一遍 kerning/ligature 解析，是纯负担。删掉后排版没有任何肉眼可见变化。

**已知噪声**：文章页 TBT 在 0–250ms 之间跳动，因为「样式 + 布局」那一次长任务（~200ms，4 倍 CPU 节流下）正好落在 FCP 附近，落在后面就算阻塞、落在前面就不算。多跑几次的中位数是 0。这个长任务的绝对耗时主要来自 CJK 字体回退（无 webfont，全靠系统字体），不是 DOM 复杂度——页面只有 266 个元素。用 `content-visibility` 压过，实测没有改善，还带来锚点跳转和 Ctrl+F 的风险，所以没上。

## 9. 里程碑

| 阶段 | 内容 | 完成标志 |
|---|---|---|
| **M0 骨架** | Astro 初始化、tokens、BaseLayout、Nav/Footer、空态首页、404 | `pnpm dev` 能跑，页面骨架与设计系统一致 |
| **M1 管线** | content schema、8 条校验、文章页、标签、系列、RSS、sitemap、OG | 塞一篇假文章，全链路产物正确 |
| **M2 上线** | 3 篇真实内容、部署、性能达标 | 公网可访问，Lighthouse ≥ 95 |
| **M3 之后** | 统计 → 搜索（Pagefind）→ 评论（giscus） | 按需，不急 |

**上线门槛：3 篇 Published。** ① featured = `lattice` 架构总览；② 一个具体取舍（如 Rust 侧状态机边界）；③ "为什么我用 Astro + MDX 而不是 Next + CMS"——第三篇是本文档的对外版本，同时用来验证代码块、图片、TOC、系列导航是否真的能用。

## 10. 风险

| 风险 | 应对 |
|---|---|
| **断更**（最大风险） | 3 篇门槛 + 每篇 2 小时写作预算 + 不追求长文，一个结论就够 |
| 图片体积失控 | 单图 200KB 上限，构建期检查，超限失败 |
| 代理 502 导致无法 push / 部署 | 部署动作统一放在本地执行，CI 只跑构建 |
| 视觉逐渐"加东西" | design-system 明确写死"零卡片零阴影"，新增组件必须先改文档 |

## 11. 未决

| 项 | 影响面 | 说明 |
|---|---|---|
| **站名** | title 模板、OG 图、页脚、favicon | 唯一还没定的东西。它是配置项（`SITE_NAME`），不阻塞实现 |
| 自有域名 | 部署 | 可后补，不构成技术债 |
| featured 首篇 | 首页 | 随第一篇内容确定 |

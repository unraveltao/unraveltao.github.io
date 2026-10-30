# 产品需求

> 这份文件是**实现与验收的依据**：有哪些页面、每页必须有什么、字段怎么填、什么算做完。
> 视觉规格在 [03-Design-System.md](./03-Design-System.md)，代码结构在 [04-Technical-Architecture.md](./04-Technical-Architecture.md)。
> 最后更新：2026-10-31

## 1. 范围

| 在范围内 | 不在范围内 |
|---|---|
| 文章列表 / 详情 / 标签 / 系列 | 评论、搜索、统计 |
| 项目列表 / 详情 | **文章推送到外部平台**（另一个项目） |
| RSS 全文、sitemap、OG 图、JSON-LD | 多语言路由（`/en`）、多作者、在线后台 |
| 浅色 + 深色主题 | 视觉预设（四套风格）、字体切换 |
| 构建期内容校验 | 运行时内容编辑 |

## 2. 路由表

| 路由 | 页面 | 生成方式 | 来源 |
|---|---|---|---|
| `/` | 首页 | 静态 | 精选 1 篇 + 最近 10 篇 |
| `/posts` | 全部文章 | 静态 | 所有非草稿 Post，按年分组 |
| `/posts/[slug]` | 文章页 | 每篇一页 | 单个 Post |
| `/tags` | 标签索引 | 静态 | 所有出现过的 Tag + 计数 |
| `/tags/[tag]` | 标签详情 | 每个标签一页 | 该 Tag 下的 Post |
| `/series/[series]` | 系列页 | 每个系列一页 | 该 Series 下的 Post，按 `order` 升序 |
| `/projects` | 项目列表 | 静态 | 全部 Project，按 `order` 升序 |
| `/projects/[slug]` | 项目详情 | 每个项目一页 | 单个 Project |
| `/about` | 关于 | 静态 | `content/pages/about.mdx` |
| `/rss.xml` | RSS 2.0 | 静态 | 最近 20 篇，全文 |
| `/sitemap-index.xml` | Sitemap | 静态 | 全部页面 |
| `/404` | 404 | 静态 | 静态文案 |

**不生成**：`/notes`、`/search`、`/archive`（归档能力已并入 `/posts`）、任何分页路由、任何 `/en` 语言路由。

## 3. 导航

**顶栏（5 项，含站名；右侧 4 个链接 + 主题按钮）**

```
[站名 → /]      work → /projects   writing → /posts   tags → /tags   about → /about
```

导航标签是 `work` 而不是 `projects`：实体与路由叫 Project / `/projects`，但顶栏要能在 375px 里和另外三个链接一起放下（实测 79 + 232 + 12 + 24 = 347px，余 28px）。标签是 UI 文案，不是领域词汇。

**页脚（一行）**

```
© 2026 <站名>    ·    rss    ·    github    ·    mail
```

页脚链接全部指向外部（RSS、仓库、邮箱），不再重复顶栏的站内链接。

## 4. 页面规格

### 4.1 首页 `/`

1. **身份区**：站名（`--text-display`）+ 一句话定位（`--text-lead`，`--ink-600`）+ 可选的"现在在做什么"一行（`--text-meta`）。
2. **精选轨**：`featured: true` 的文章，最多 1 篇，用比列表项更大的标题（`--text-h2`）单独呈现。**没有任何 featured 时整块不渲染**，不留空位、不留占位文案。
3. **最近文章**：10 篇，列表项规格见设计系统 §8。不做分页——看更多的入口是顶栏 `writing`。
4. 页脚。

首页**不放**标签云、统计数字、头像。

### 4.2 全部文章 `/posts`

- 按年份分组，年份是 `--text-meta` 的一行标签，组内按 `date` 倒序。
- 组间用 1px `--line` 分隔，组内靠留白。
- 总数 < 100 时不分页、不折叠；超过 100 再引入按年折叠。

### 4.3 文章页 `/posts/[slug]`

```
标题 (h1)
日期 · 阅读时长 · 标签          ← 一行 meta，用 · 分隔
导语 (summary)
──────────────────────────────
正文 …
──────────────────────────────
[系列导航]  若属于 series：本系列第 n 篇 / 共 m 篇 + 其余篇目
[上一篇 / 下一篇]
```

- 阅读时长 = 中文字符数 / 400 + 英文单词数 / 200，向上取整。
- 文章页的 `h1` 就是标题，正文内标题从 `h2` 起，**不跳级**。
- `updated` 与 `date` 不同时，meta 行显示 `2026-11-02 · 更新于 2026-11-10`。

### 4.4 标签 `/tags` 与 `/tags/[tag]`

- 索引页：一行一个标签，`#tag` + 文章数（等宽），按文章数倒序，数量相同按字母序。
- 标签是纯字符串：**没有描述、没有图标、没有颜色**。
- 详情页复用文章列表项；页头只有 `#tag` 与总数。

### 4.5 系列 `/series/[series]`

- 页头：系列名 + 一句话说明 + 篇数。
- 有序列表，每项带两位序号（`01`、`02`，等宽）。
- 只列已发布的篇目；`order` 有空洞不算错误，序号按实际顺序重排显示。

### 4.6 关于 `/about`

固定 MDX 页，复用文章页的正文排版（但不显示日期、TOC、上下篇）。内容约定：身份一段、现在在做什么一段、联系方式一行。

### 4.7 404

一句人话（"这个地址没有内容"）+ 回首页与看全部文章的链接。**不做**好玩的插画。

### 4.8 项目列表 `/projects`

- 复用文章列表项的排版（标题 + 一句话 + 元信息），**不做卡片、不做缩略图网格**。
- 元信息行换成 `状态 · 技术栈`：状态是纯文字（`进行中` / `已完成` / `已归档`），技术栈取前 3 个，等宽小写。
- 排序用 `order` 升序，不按年分组、不按状态分组。
- **只有 1 个项目时也照常渲染**，不出现"更多项目即将上线"之类的占位文案。

### 4.9 项目详情 `/projects/[slug]`

```
项目名 (h1)
状态 · 技术栈 · 仓库 / 演示          ← 一行 meta，用 · 分隔；没有的链接不渲染
一句话（summary）
──────────────────────────────
正文 …（MDX，复用文章正文排版）
```

- 不显示日期、TOC、上一篇/下一篇——项目没有"发表时间"这个概念。
- 状态不能只靠颜色表达，必须有文字（设计系统 §9）。
- 没有 `repo` / `demo` 时不显示空链接，也不显示"暂无"。

## 5. 内容模型

> 决策来源：[ADR-0002](./adr/0002-mdx-in-repo.md)（MDX 存仓库）、[ADR-0005](./adr/0005-post-only-content-model.md)（只有 Post 一种类型）。

### 5.1 两种实体：Post 与 Project

站内只有两个内容实体。Note 不存在；Series 是 Post 的字段，不是独立对象。

| 实体 | 是什么 | 进 RSS | 进标签 | 有日期 |
|---|---|---|---|---|
| **Post** | 一篇文章 | ✅ | ✅ | ✅ |
| **Project** | 做过的一个东西 | ❌ | ❌ | ❌ |

Project 是**并列**于 Post 的实体，不是 Post 的分类，也不属于任何 Series（[ADR-0007](./adr/0007-project-as-second-entity.md)）。

### 5.2 文件布局

```
content/
├── posts/
│   └── tauri-state-machine/        ← 目录名 = slug
│       ├── index.mdx
│       ├── fig-01-state-graph.png
│       └── fig-02-timeline.png
├── projects/
│   └── lattice/                    ← 目录名 = slug
│       ├── index.mdx
│       └── shot-01.png
├── pages/
│   └── about.mdx
└── series.json                     ← 系列 slug → 显示名/描述的对照表
```

图片与文章**同目录**：删文章 = 删一个文件夹，图片不会变成孤儿；MDX 里用相对路径引用（`![状态图](./fig-01-state-graph.png)`），构建期自动优化。

### 5.3 Frontmatter 字段

| 字段 | 类型 | 必填 | 默认 | 说明 |
|---|---|---|---|---|
| `title` | string | ✓ | — | 中文标题，≤ 40 字 |
| `summary` | string | ✓ | — | 一句话结论，20–160 字。同时作为列表摘要与 `meta description` |
| `date` | `YYYY-MM-DD` | ✓ | — | 首次发布日；晚于构建日则视为未发布 |
| `updated` | `YYYY-MM-DD` | | — | 只有**实质性修改**才填，改错别字不填 |
| `slug` | string | | 目录名 | kebab-case，发布后永不修改 |
| `tags` | string[] | ✓ | — | 1–3 个，小写 kebab-case |
| `series` | string | | — | 系列 slug，必须在 `series.json` 中存在 |
| `order` | number | | — | 有 `series` 时必填，从 1 开始，整数 |
| `project` | string | | — | 关联项目标识（如 `lattice`），仅用于展示 |
| `featured` | boolean | | `false` | 首页精选轨；**全站最多 1 篇** |
| `draft` | boolean | | `false` | `dev` 可见并带角标，`build` 排除 |

`series.json` 结构（唯一一个非 Post 的数据文件，只是一张对照表，没有生命周期）：

```json
{
  "lattice-teardown": { "name": "lattice 拆解", "description": "把一个 Tauri 应用从架构到落地拆开看。" }
}
```

### 5.4 Schema

schema 的**唯一真源**是 [`src/content.config.ts`](../src/content.config.ts)，本节只说明意图，不复制代码——复制会漂移。

要点：
- `slug` / `tags` / `series` 共用 `kebab` 正则；
- `summary` 20–160 字，`title` ≤ 40 字；
- 单文件级约束用 zod `.refine()`，例如「有 `series` 必有 `order`」；
- 跨文件约束无法在 schema 里表达，必须放构建脚本（见 §5.5）。

### 5.5 校验规则（构建期，违反即失败）

| # | 规则 | 实现位置 | 状态 |
|---|---|---|---|
| 1 | `summary` 为空或 < 20 字 → 失败；> 160 字 → 失败 | schema | ✅ 已实现 |
| 2 | `series` 有值但 `order` 缺失 → 失败 | schema `.refine()` | ✅ 已实现 |
| 3 | 同一 `series` 内 `order` 重复 → 失败 | `scripts/validate-content.mjs` | ✅ 已实现 |
| 4 | `series` 的值不在 `series.json` 里 → 失败 | `scripts/validate-content.mjs` | ✅ 已实现 |
| 5 | `featured: true` 超过 1 篇 → 失败 | `scripts/validate-content.mjs` | ✅ 已实现（只算非草稿） |
| 6 | `updated` 早于 `date` → 失败 | `scripts/validate-content.mjs` | ✅ 已实现 |
| 7 | `slug` 或 `tags` 不符合 kebab-case → 失败 | schema | ✅ 已实现 |
| 8 | 同一 slug 出现在两个目录 → 失败 | loader / 构建脚本 | ⚠️ 部分：目录名天然唯一，但 frontmatter 的 `slug` 可覆盖目录名，覆盖后重复不会报错 |
| 9 | `status` 不在 `active` / `done` / `archived` 枚举内 → 失败 | Project schema | ✅ 已实现 |
| 10 | `stack` 为空数组 → 失败 | Project schema | ✅ 已实现 |

规则 3–6 需要跨文件检查，放在 `scripts/validate-content.mjs` 里跑，不放在单文件 schema 里。`pnpm build` 的第一条命令就是它，**失败则不进入 astro check，更不进入 astro build**。

规则本身是纯函数，在 `scripts/lib/content-rules.mjs`；CLI 只负责读盘与打印。`pnpm test` 跑 `tests/content-rules.test.mjs` 的回归。

这个脚本不引入 YAML 解析依赖，只读 `series` / `order` / `featured` / `date` / `updated` / `draft` 六个标量字段；读不懂就报错，不静默放过。

### 5.6 写作约定

- 正文**不用 `h1`**（标题由 `title` 渲染），标题层级从 `h2` 起，不跳级。
- 代码块必须标语言，否则不高亮也不显示标签。
- 图片必须有 `alt`；纯装饰图写空字符串。
- 外链用完整 `https://`；站内链接用根相对路径（`/posts/xxx`）。
- 中文段落不用斜体（见设计系统 §3）。
- 每篇至少一个可被引用的结论句，放在 `summary` 里。

### 5.7 Project 字段

| 字段 | 类型 | 必填 | 默认 | 说明 |
|---|---|---|---|---|
| `name` | string | ✓ | — | 项目名，≤ 24 字 |
| `summary` | string | ✓ | — | 一句话说清它解决什么问题，20–80 字 |
| `status` | enum | ✓ | `active` | `active` / `done` / `archived`，渲染成中文文字 |
| `stack` | string[] | ✓ | — | 技术栈，1–5 个，小写 kebab-case，如 `rust` `tauri` `typescript` |
| `repo` | url | | — | 仓库地址，完整 `https://` |
| `demo` | url | | — | 在线演示地址 |
| `order` | number | | — | 列表顺序，从 1 开始，整数；缺省时按 `name` 排序 |
| `slug` | string | | 目录名 | kebab-case，发布后永不修改 |
| `draft` | boolean | | `false` | `dev` 可见，`build` 排除 |

**没有 `date`。** 项目不是"发表"出来的，加日期会逼着人给项目编一个时间线。
**slug 命名空间与 Post 独立**：`/posts/lattice` 与 `/projects/lattice` 可以共存，不冲突。

## 6. 状态与边界

| 情况 | 行为 |
|---|---|
| **草稿** `draft: true` | `dev` 可见（带角标），`build` 时排除，且不进 RSS / sitemap / 标签计数 |
| **未来日期** | `date` 晚于构建时间时按草稿处理（定时发布的替代方案：到点重新构建） |
| **空标签** | 删除最后一篇后标签自动消失，`/tags/[tag]` 不再生成 |
| **空系列** | `series` 存在但只有 1 篇时，仍生成系列页（读者需要知道"这是第一篇"） |
| **缺 `summary`** | 构建失败，不允许空描述上线 |
| **图片缺失 / 外链图** | 允许，但外链图不做优化，且在 lint 里告警（lint 尚未接入） |

## 7. 写作流程

```bash
# 1. 建骨架（手写亦可：content/posts/<slug>/index.mdx）
pnpm dev                               # 本地预览，草稿可见
# 2. 写，提交即发布
git add . && git commit -m "post: ..."
# 3. push 到 main 触发 Actions 构建发布
```

> 注意：文档里曾提到的 `pnpm new "<标题>"` 脚手架脚本**尚未实现**（`package.json` 只有 `dev` / `build` / `preview`）。目前新建文章是手写 `index.mdx`。

## 8. Feed 与元数据

| 项 | 规格 |
|---|---|
| `<html lang>` | `zh-CN` |
| `<title>` | 文章页 `{title} · {站名}`；项目页 `{name} · {站名}`；其余 `{站名} — {tagline}` |
| `description` | 取 `summary`，长度 140–160 字符 |
| canonical | 每页绝对 URL，带尾斜杠 |
| OG / Twitter | `og:type=article`（文章页）、`og:image` 为构建期生成的 1200×630 PNG |
| OG 图模板 | 纸白底 + `#0F6E56` 细线 + 标题（最多 2 行）+ 站名，字体与站点一致 |
| JSON-LD | 文章页注入 `BlogPosting`：`headline`、`datePublished`、`dateModified`、`author`、`image`、`inLanguage: zh-CN` |
| RSS | 最近 20 篇，**全文**（`content:encoded`）——个人博客的读者用阅读器，摘要式 RSS 会逼他们跳转。**Project 不进 RSS** |
| robots.txt | 全站允许，指向 sitemap |

## 9. URL 不变式

1. 所有页面 URL **带尾斜杠**（`trailingSlash: 'always'`）。GitHub Pages 是目录式托管，不带斜杠会被 301 到带斜杠版本，两个 URL 并存会让 canonical 指向一个会跳转的地址。
2. slug 全小写 kebab-case，**一经发布永不修改**。
3. URL 里不出现日期。
4. 分页（若将来引入）不用 `?page=`，用 `/posts/page/2`。
5. 中文不进 URL——包括标签和系列。

## 10. 非功能需求

### 10.1 性能预算

| 指标 | 上限 |
|---|---|
| 首屏 JS（gzip） | ≤ 15KB（只有主题切换 + TOC 高亮） |
| 首页 HTML（gzip） | ≤ 60KB |
| LCP（4G / 中端机） | < 1.2s |
| CLS | < 0.02 |
| 字体下载 | Latin 子集 ≤ 60KB，CJK **零下载**（走系统字体） |
| 正文单图 | ≤ 200KB |
| Lighthouse | 文章页四项均 ≥ 95 |

### 10.2 无障碍底线

- 所有文字对比度 ≥ 4.5:1（13px 的元信息也算「小字」，不能套用 3:1 的宽松档），正文目标 ≥ 7:1。
- 移动端正文不小于 17px；可点区域不小于 44×44（列表整行可点已满足）。
- 所有交互可用键盘完成，Tab 顺序与视觉顺序一致。
- 语义结构：每页一个 `<h1>`，标题层级不跳级；`<nav>` / `<main>` / `<article>` / `<footer>` 齐备。
- 图片 `alt` 必填；纯装饰图 `alt=""`。

## 11. 完成定义（一篇 Post）

**构建通过 → 375px 无横向滚动 → 键盘可走完全流程 → OG 图渲染正确 → RSS 含全文 → Lighthouse 达标。**

这六项全绿才算"发完了"，缺一项都算草稿。

## 12. 完成定义（一个 Project）

**列表可见 → 详情页能回答三个问题（解决什么问题 / 用什么技术 / 现在什么状态）→ 375px 无横向溢出 → 状态用文字表达而非颜色 → 不在 RSS 与标签页出现。**

项目没有"发布日期"，所以没有"发完了"这个状态，只有"够不够让人看懂"。

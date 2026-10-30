# 开发路线图

> 这份文件只回答两件事：**已经做到哪了**、**下一步做什么，为什么是它**。
> 里程碑定义来自最初的 M0–M3 划分，状态按 2026-10-31 的实际代码核对过。
> 最后更新：2026-10-31

## 1. 里程碑状态

| 阶段 | 内容 | 完成标志 | 状态 |
|---|---|---|---|
| **M0 骨架** | Astro 初始化、tokens、BaseLayout、Nav/Footer、空态首页、404 | `pnpm dev` 能跑，页面骨架与设计系统一致 | ✅ 已完成 |
| **M1 管线** | content schema、校验、文章页、标签、系列、RSS、sitemap、OG | 塞一篇假文章，全链路产物正确 | ✅ 已完成（校验缺 3 条，见 §2） |
| **M2 上线** | 3 篇真实内容、部署、性能达标 | 公网可访问，Lighthouse ≥ 95 | ✅ 已完成（4 篇，线上四项 99–100） |
| **M3 项目展示** | Project collection、`/projects` 列表与详情、顶栏入口 | 两个路由上线，`lattice` 可见，RSS 与标签不受影响 | ✅ 已完成 2026-10-31 |
| **M4 之后** | 统计 → 搜索（Pagefind）→ 评论（giscus） | 按需，不急 | ⬜ 未启动（有意不做） |

**上线门槛已达成**：三篇分工文章全部就位——`lattice-architecture`（精选/架构总览）、`tauri-state-machine`（具体取舍）、`why-astro-mdx`（技术选型自述）。

## 2. 当前快照

| 项 | 实际 |
|---|---|
| 文章 | 4 篇（1 篇 featured，1 个系列 2 篇，其余独立） |
| 项目展示 | 1 个（`lattice`），`/projects` 与 `/projects/lattice/` 已上线 |
| 构建产物 | 18 个 HTML + `rss.xml` + `sitemap-index.xml` |
| 线上性能 | 文章页移动端 99/100/100/100；LCP 1.2s；TBT 0–130ms；CLS 0 |
| 请求数 | 全站 0 个 script 请求，2 个请求，8KiB（gzip） |
| 校验覆盖 | 8 条规则中 3 条完全生效（1/2/7）、1 条部分生效（8）、3 条缺失（3/4/5）、1 条待加（6） |
| 工具链 | 只有 `dev` / `build` / `preview`，无 typecheck、无 lint、无 test |

## 3. 下一步

### ✅ 已完成 — `/projects`（2026-10-31）

新增 `projects` collection、`src/lib/projects.ts`、`ProjectItem.astro`、`/projects` 与 `/projects/[slug]` 两个路由，顶栏加 `work` 入口，首个内容 `lattice`。

实测：18 个页面构建通过；375px 下导航 347px / 375px 无溢出（`docScrollW = 375`）；sitemap 含两个新路由；RSS 仍 4 条、0 条项目。

**偏差记录**：原计划顶栏标签用 `projects`，实测 375px 放不下，改成 `work`（见 `docs/02` §3）。原计划状态与技术栈分两行，实现时合成一行元信息——与文章列表项的形状更一致。

### ✅ 已完成 — 跨文件内容校验（2026-10-31）

`scripts/validate-content.mjs` 补齐规则 3–6（`order` 重复 / `series` 不存在 / `featured` 超一篇 / `updated < date`），`build` 改成 `validate → astro build`。

实测：造三个坏样例（重复 `order`、`series: typo-series`、第二篇 `featured`）后 `pnpm build` 退出码 1，报错直接给出文件路径与字段；正常内容通过（4 篇 / 1 系列 / 1 精选）。

**偏差记录**：没有引入 YAML 解析依赖，改用只认六个标量字段的手写解析器——读不懂就报错，不静默放过。代价写进 `docs/04` §8 技术债 6。

### P1 — 让工具链能兜住类型与格式

**为什么**：`tsconfig` 是 `strict`，但没有 `astro check` 在跑，严格模式的价值只在编辑器里兑现。多人（或 agent）协作时，没有 lint 就没有一致的格式基线。

**怎么做**：
1. 加 `@astrojs/check` + `typescript`，`"check": "astro check"`；
2. 加 `prettier` + `prettier-plugin-astro`，`"format": "prettier --write ."`；
3. CI 的 build job 前插入 `pnpm check`（格式化只做本地，不进 CI，避免噪声）。

**完成标志**：`pnpm check` 零错误；故意写一个类型错误能被它拦住。

### P1 — 测试最小闭环

**为什么**：校验脚本本身也需要回归保护——它是"构建失败即拦截"的最后一道闸，闸坏了没人知道。

**怎么做**：用 Node 内置 `node:test`（零依赖，符合 §5 依赖策略），把校验规则写成纯函数，`tests/content-validation/` 下放合法/非法 fixture，逐条断言。目录约定见 [`tests/README.md`](../tests/README.md)。

**完成标志**：`node --test tests/` 覆盖 4 条跨文件规则 + 2 条 schema 规则；删掉任一规则对应实现，测试变红。

### P2 — 逐篇 OG 图

**为什么**：现在所有文章共用一张 `public/og.png`，分享到社交平台时四篇文章长得一模一样，削弱了"代表作"的辨识度。设计系统里 OG 模板（纸白 + `#0F6E56` 细线 + 两行标题）早就定了，只差实现。

**怎么做**：构建期用 `satori` 或纯 SVG → PNG（需评估是否引入依赖，会破坏"零第三方"），或在 `public/og/` 下手写几张静态图按 slug 映射。后者零依赖但不可扩展。

**完成标志**：每篇 Post 的 `og:image` 指向自己的图，1200×630，标题两行内不溢出。

### P2 — `pnpm new` 脚手架

**为什么**：手写 frontmatter 容易漏 `summary` 或写错日期格式，而这些错误要等到 build 才报。脚手架把"必然正确的骨架"前置。

**完成标志**：`pnpm new "标题"` 生成 `content/posts/<slug>/index.mdx`，slug 由标题转写（中文则要求手输），frontmatter 字段齐全且通过校验。

## 4. 长期（M3+，按需启动）

顺序是有意的：**统计 → 搜索 → 评论**。理由是每一层对"零后端"的破坏程度递增。

| 项 | 触发条件 | 方案 | 代价 |
|---|---|---|---|
| 阅读统计 | 想知道哪类选题值得写 | 自建轻量计数或第三方（Plausible/Umami） | 引入一次网络请求 |
| 站内搜索 | 文章数 > 30 | Pagefind（构建期索引，运行时纯静态） | +1 个 JS 文件，约 10KB |
| 评论 | 真的有人想讨论 | giscus（GitHub Discussions） | +1 个第三方 iframe |
| 自定义域名 | 想摆脱仓库名锁死 | CNAME + 改 `site` 一处 | 几乎为零 |

## 5. 排期建议

依赖关系决定了顺序，不要跳：

```
P1 测试 ── 对象是 scripts/validate-content.mjs（规则 3–6 已完成，缺回归保护）
P1 check/lint ── 独立，可与测试并行
P2 OG 图 ── 独立，随时可做；做完 `titleEn` / `summaryEn` 才生效
P2 脚手架 ── 校验规则已稳定，可以做了
```

**不要同时开两条 P0/P1**。单人维护的项目，并行的代价不是时间，是每条线都要重新捡起上下文。

## 6. 每篇文章的完成定义

不管路线图怎么排，一篇 Post 的 DoD 不变（见 [02-Product-Requirements.md §11](./02-Product-Requirements.md#11-完成定义一篇-post)）：

**构建通过 → 375px 无横向滚动 → 键盘可走完全流程 → OG 图渲染正确 → RSS 含全文 → Lighthouse 达标。**

## 7. 这份文件的维护方式

- 里程碑状态**只在真正完成时**改，不写"进行中 80%"。
- 新增待办时写清**触发条件**（什么情况下才值得做），而不是"以后可能要做"。
- 完成一项后不删条目，标 ✅ 并写明完成日期；被否决的项移到 §4 并说明为什么不做。

# 开发路线图

> 这份文件只回答两件事：**已经做到哪了**、**下一步做什么，为什么是它**。
> 里程碑定义来自最初的 M0–M3 划分，状态按 2026-10-31 的实际代码核对过。
> 最后更新：2026-10-31

## 1. 里程碑状态

| 阶段 | 内容 | 完成标志 | 状态 |
|---|---|---|---|
| **M0 骨架** † | Astro 初始化、tokens、BaseLayout、Nav/Footer、空态首页、404 | `pnpm dev` 能跑，页面骨架与设计系统一致 | ✅ 已完成 |
| **M1 管线** | content schema、校验、文章页、标签、系列、RSS、sitemap、OG | 塞一篇假文章，全链路产物正确 | ✅ 已完成（校验缺 3 条，见 §2） |
| **M2 上线** | 3 篇真实内容、部署、性能达标 | 公网可访问，Lighthouse ≥ 95 | ✅ 已完成（当时 4 篇，线上四项 99–100） |
| **M3 项目展示** | Project collection、`/projects` 列表与详情、顶栏入口 | 两个路由上线，`lattice` 可见，RSS 与标签不受影响 | ✅ 已完成 2026-10-31 |
| **迁移** | Astro → Vite 7 + React 19 + React Router 7 + Velite（ADR-0011） | 18 个页面产物不变、正文文本 1:1、`test` / `build` 全绿 | ✅ 已完成 2026-10-31 |
| **M4 之后** | 统计 → 搜索（Pagefind）→ 评论（giscus） | 按需，不急 | ⬜ 未启动（有意不做） |

† M0–M3 里的"Astro"字样是历史记录，保留原样不追改；2026-10-31 起渲染层已换成 Vite + React Router，细节见 §3 与 ADR-0011。

**上线门槛（3 篇 Published）当前只算勉强达成**：`lattice-architecture`（精选/架构总览）、`tauri-state-machine`（具体取舍）都在，第三篇本该是技术选型自述，但那篇（`why-astro-mdx`）已因与新栈矛盾被删除，现在顶上来的是 2024 年的占位文 `hello-world`。缺口待补，见 §3。

## 2. 当前快照

| 项 | 实际 |
|---|---|
| 文章 | 3 篇（1 篇 featured，1 个系列 2 篇，`hello-world` 独立） |
| 项目展示 | 1 个（`lattice`），`/projects` 与 `/projects/lattice/` 已上线 |
| 构建产物 | 15 个 HTML + `rss.xml` + `sitemap-index.xml`，输出在 `build/client/` |
| 线上性能 | 迁移前（Astro）文章页移动端 99/100/100/100，LCP 1.2s，TBT 0–130ms，CLS 0；**迁移后待重测** |
| 请求数 | 迁移前 0 个 script 请求 / 共 2 个请求 / 8KiB；迁移后首屏 JS **121.8KB gzip**（entry 66.6 + jsx-runtime 42.8 + content 7.2 + 其余），预算上限 130KB |
| 校验覆盖 | 10 条规则中 9 条完全生效，1 条部分生效（8：frontmatter `slug` 覆盖目录名后可能重复） |
| 工具链 | `dev` / `content` / `validate` / `check` / `test` / `build` / `preview`；无 lint、无格式化 |

## 3. 下一步

### ✅ 已完成 — 迁移到 Vite + React Router（2026-10-31）

**为什么**：不是为了性能。Astro 的"零 JS"在这个站上是真实收益（迁移前首屏 0 个 script 请求），但作者不熟悉它的组件模型，每次改动都要重新学一遍；可扩展性也被 `.astro` 的边界限制住。这是一次**用确定的性能代价换确定的熟悉度与可扩展性**的交换（[ADR-0011](./adr/0011-vite-react-router.md)）。

**做了什么**：

1. 渲染层：Astro 5 → Vite 7 + React 19 + React Router 7 framework mode，`ssr: true` + `prerender` 清单，产物仍是 18 个静态目录。
2. 内容层：Content Collections → Velite 0.4（zod schema + `s.markdown()` + `s.toc()` + `s.raw()`）；Shiki 双主题、`rehype-slug`、code-window 插件原样搬过来。
3. 样式：`.astro` 的作用域 `<style>` → CSS Modules + `global.css`；token 文件一行未改。
4. 构建后处理：`scripts/postbuild.mjs` 内联 CSS、`404/index.html` → `404.html`、生成 `rss.xml` 与 sitemap。
5. 预览：`scripts/serve.mjs` 复刻 GitHub Pages 的 301 与 404 回落，替掉 `vite preview`。

**实测**：18 个页面全部预渲染；正文文本与迁移前逐页对比，7 页完全一致、11 页只差空白字符；`pnpm test` 27/27；`pnpm build` 退出码 0（内联 43 段 CSS、RSS 4 条、sitemap 17 条）。浏览器冒烟：hydration 后 `data-theme` 保持、主题切换生效、目录跟随滚动、站内跳转不整页刷新、0 个失败请求、0 条控制台错误。

**偏差记录**：

- Velite 的 `s.slug()` 没有来源，必须从 `path` 派生；`s.mdx()` 产出 `function-body`，没法直接当 HTML 用，改用 `s.markdown()`。
- `output.clean` 必须关掉——`react-router.config.ts` 在构建期读 `.velite/*.json`，清空会让它 ENOENT。
- `routeDiscovery` 默认 `lazy`，会去请求 `/__manifest`；静态托管没这个端点，站内跳转全掉进 ErrorBoundary。改成 `initial`。
- postbuild 内联 CSS 后**不能删** `assets/*.css`，路由清单仍引用这些文件名。
- React 会移除 `<html>` 上的未知属性，内联脚本写的 `data-theme` 在 hydration 时丢失；靠 `suppressHydrationWarning` + `useLayoutEffect` 补回。
- canonical 从 `links` 移到 `meta`：预渲染时 `links()` 是无参调用的，类型对不上。

**代价**：首屏 JS 从 0 变成 121.8KB gzip。这是唯一一项变差的指标，写进 ADR-0011 的 Consequences，并在 AGENTS §4.4 设了 130KB 上限。

### ✅ 已完成 — `/projects`（2026-10-31）

新增 `projects` collection、`src/lib/projects.ts`、`ProjectItem.astro`、`/projects` 与 `/projects/[slug]` 两个路由，顶栏加 `work` 入口，首个内容 `lattice`。

实测：18 个页面构建通过；375px 下导航 347px / 375px 无溢出（`docScrollW = 375`）；sitemap 含两个新路由；RSS 仍 4 条、0 条项目。

**偏差记录**：原计划顶栏标签用 `projects`，实测 375px 放不下，改成 `work`（见 `docs/02` §3）。原计划状态与技术栈分两行，实现时合成一行元信息——与文章列表项的形状更一致。

### ✅ 已完成 — 跨文件内容校验（2026-10-31）

`scripts/validate-content.mjs` 补齐规则 3–6（`order` 重复 / `series` 不存在 / `featured` 超一篇 / `updated < date`），`build` 改成 `validate → astro build`。

实测：造三个坏样例（重复 `order`、`series: typo-series`、第二篇 `featured`）后 `pnpm build` 退出码 1，报错直接给出文件路径与字段；正常内容通过（4 篇 / 1 系列 / 1 精选）。

**偏差记录**：没有引入 YAML 解析依赖，改用只认六个标量字段的手写解析器——读不懂就报错，不静默放过。代价写进 `docs/04` §8 技术债 6。

### ✅ 已完成 — 校验可测化 + 类型检查 + 草稿可见性（2026-10-30）

三件原本并列在 P1 的事一起做了，因为它们共用同一批文件：

1. **规则抽成纯函数**：`scripts/lib/content-rules.mjs` 导出 `parseScalarFields` + 四条规则 + `checkAll`，返回 `Problem[]` 而不是抛异常——一次报全部违规。`scripts/validate-content.mjs` 瘦成读盘 + 打印的 CLI。
2. **类型检查进构建**：`@astrojs/check` + `typescript@^5` 装成 devDependency，`build` 变成 `validate → astro check → astro build`。实测 31 个文件 0 errors / 0 warnings / 0 hints。
3. **草稿可见性**：`isPublished()` 与 `getProjects()` 在 `import.meta.env.DEV` 下不再过滤，草稿与未来日期都能本地预览，列表项与详情页带"草稿"角标（单色文字，不加底色边框）。

实测：`pnpm test` 27 个用例全绿；`pnpm validate` 输出与改动前一致（4 篇 / 1 系列 / 1 精选）。

**顺手修的 bug**：规则 4 原来用 `key in seriesRegistry`，走原型链——`series: constructor` / `toString` / `__proto__` 会**静默通过**校验。改成 `Object.hasOwn`，并写了回归用例锁住。

**偏差记录**：
- `node --test tests` 在本机 Node 22 + Windows 上把目录当成模块入口去 require，报 `MODULE_NOT_FOUND`；改用 `node --test "tests/**/*.test.mjs"`（引号内交给 Node 自己展开 glob，不依赖 shell）。
- 测试用内联对象而非 fixture 文件：规则是纯函数，读盘由 CLI 负责，fixture 只会多一层间接。
- `typescript` 必须锁 `^5`——`pnpm add -D typescript` 默认装到 7.x，而 `@astrojs/check` 与 `@volar` 都要求 `<7`。
- 计划里原写"CI 加一个独立 check job"，实现时改为串进 `build` 脚本，`deploy.yml` 一行未动——`withastro/action@v3` 内部就是跑 `pnpm run build`。

> 以上四条写于 2026-10-30 ～ 10-31 的 Astro 时期，路径与命令保留原文（`src/lib/*.ts`、`ProjectItem.astro`、`astro check` 等）。迁移后的对应关系见 `docs/04` §3 的目录树。

### P1 — 迁移后的 Lighthouse 重测

**为什么**：99/100/100/100 是在 Astro 构建上测的。现在多了 121.8KB JS，LCP 与 TBT 都会变，不重测就等于没有数据，而 ADR-0011 的结论正是拿这个数字换来的。

**完成标志**：文章页移动端 4G 节流重跑，四项数字记进 §2；若低于 95，先按 ADR-0011 的 Consequences 判断是接受还是回退，不要直接改预算。

### ✅ 已完成 — 删除 `why-astro-mdx`（2026-10-31）

**为什么删**：那篇的标题就是"为什么这个站用 Astro + MDX，而不是 Next + CMS"，全文在为 Astro 的"默认零 JS"辩护。栈迁到 React Router 之后（ADR-0011），这不是"过时的补充说明"能救的程度——论证方向与站点现状直接相反，留着比空着更糟。

**改了什么**：`git rm -r content/posts/why-astro-mdx/`。它是 `astro` 与 `writing` 两个标签的**唯一**文章，所以两个标签页一并消失；无系列、非精选，没有别的文章链到它。

**实测**：页面 18 → **15**（少 1 篇 + 少 2 个标签页）；RSS 4 → 3 条；sitemap 17 → 14 条；`pnpm test` 27/27；`pnpm build` 退出码 0。

**代价（已接受）**：`/posts/why-astro-mdx/` 曾经是线上公开 URL，删除后 404，没有重定向——GitHub Pages 是静态托管，做重定向得额外造一个跳转页，那是新增一条路由，本轮没做。若日后发现外部有引用，再补。

**顺带暴露的缺口**：上线门槛要的三篇里，"技术选型自述"这一篇现在没了，顶上来的 `hello-world` 是 2024 年的占位文。见下一条 P1。

### P1 — 补一篇技术选型自述

**为什么**：`docs/01` §5 的上线门槛是 3 篇、各有分工，第 3 篇（技术选型自述）随 `why-astro-mdx` 一起没了。现在 3 篇里有一篇是占位文，门槛算勉强达成，不是真的达成。

**怎么写**：不要再写"为什么用 Astro"——那是过去时。写**这次迁移**：为什么熟悉度值得用 121.8KB 首屏 JS 去换、为什么拒绝 SPA 模式、为什么内容层选 Velite 而不是留在 Astro 生态。素材已经在 ADR-0011 的 Considered Options 与 Consequences 里，不用重新论证。

**完成标志**：新文章进 `content/posts/`，`docs/01` §5 第 3 条不再标"缺位"，`docs/05` §1 的上线门槛注释改回"已达成"。

### P1 — 视觉重做（Tailwind / shadcn 是目标上限）

**为什么**：迁移只做到"1:1 不倒退"，视觉没有变好看。这是最初三个诉求里唯一还没动的那个。

**怎么做**：已记录的**上限**是引入 Tailwind + shadcn（ADR-0011）。真要动的时候按这个顺序：

1. 先在 `docs/06` 立一条决策，说清它解决哪个具体的视觉问题——"更现代"不算问题描述。
2. 再改 `docs/03` 的 token 与组件规格，**先改文档后改代码**。
3. 最后才动实现。`AGENTS.md` §4.1 的六条（零卡片、零阴影、单一强调色、圆角三档、纯文字标签、焦点环）是这次重做的输入，不是障碍；要推翻其中任何一条，同样得先立决策。

**完成标志**：`docs/03` 有新版规格，代码与规格一致，375px 无横向滚动，首屏 JS 不因 UI 库再涨过 130KB。

### P1 — 让工具链能兜住类型与格式（类型部分 ✅ 2026-10-30，格式未做）

**为什么**：`tsconfig` 是 `strict`，但构建里没有类型检查在跑，严格模式的价值就只在编辑器里兑现。多人（或 agent）协作时，没有格式化就没有一致的格式基线。

**已完成**：`typescript` 装好，`"check": "react-router typegen && tsc --noEmit"`，并串进 `build`——CI 不用改 workflow 就带上了。迁移到 React Router 后，类型来源从 `@astrojs/check` 换成 `react-router typegen` 生成的路由类型（`Route.LoaderArgs`、`Route.MetaArgs` 等）。

**还没做**：`prettier`，`"format": "prettier --write ."`。格式化只做本地，不进 CI，避免噪声。迁移后不再需要 `prettier-plugin-astro`，但需要 `prettier-plugin-tailwindcss` 的那一天是视觉重做之后的事。

**完成标志**：`pnpm check` 零错误 ✅；故意写一个类型错误能被它拦住 ✅。

### P1 — 测试最小闭环（✅ 2026-10-30）

**为什么**：校验脚本本身也需要回归保护——它是"构建失败即拦截"的最后一道闸，闸坏了没人知道。

**实际做法**：Node 内置 `node:test`（零依赖，符合 §5 依赖策略），规则抽到 `scripts/lib/content-rules.mjs` 变成纯函数，`tests/content-rules.test.mjs` 用内联对象逐条断言。目录约定见 [`tests/README.md`](../tests/README.md)。

**完成标志**：覆盖 4 条跨文件规则 + `parseScalarFields` 的 9 种输入，共 27 个用例 ✅；删掉任一规则实现，测试变红 ✅。

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
P1 测试 ── ✅ 已完成（2026-10-30，规则抽成纯函数 + node:test）
P1 check/lint ── ✅ 类型检查已完成；lint 仍未做（见 04 §8）
迁移 ── ✅ 已完成（2026-10-31，ADR-0011）
删 why-astro-mdx ── ✅ 已完成（2026-10-31，与新栈矛盾）
P1 Lighthouse 重测 ── 迁移的直接尾巴。先做这个，否则后面判断"性能还行不行"没有基线
P1 技术选型自述 ── 补上线门槛的第 3 篇；素材在 ADR-0011 里，不用重新论证
P1 视觉重做 ── 依赖 03 的新规格；先改文档再改代码
P2 OG 图 ── 独立，随时可做；做完才需要重新引入英文标题字段（ADR-0009）
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

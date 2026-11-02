# AGENTS.md

> 这份文件规定 **agent（以及人类协作者）在这个仓库里干活时的行为边界**：能改什么、不能改什么、改完必须同步什么。  
> 与代码不一致时分两种：**规范以本文档为准**，**现状以 `docs/04` §7 的偏差登记为准**——照规范写新东西，别为了对齐一条偏差顺手改造全站。与 `docs/06-Decision-Log.md` 的已生效决策冲突时，**停下来问人**，不要自行裁决。

最后更新：2026-11-02

---

## 1. 项目速览

当前定位遵循 ADR-0012：以个人主页与作品集为主；Post 收录重要方法论、技术取舍与实践总结。首页用现有项目 order 与文章 featured 策展，不设文章数量或更新频率门槛。Workshop/Workflow 保留旧地址，退出首页与主导航。当前实现与规范的差距集中在 `docs/04` §7 的**偏差登记**里，登记项不作为新样式的先例。

| 项    | 内容                                            |
| ---- | --------------------------------------------- |
| 是什么  | 静态个人站：个人主页与作品集 + 精选技术写作，Vite 7 + React 19 + React Router 7（全站预渲染） |
| 线上   | <https://unraveltao.github.io>                |
| 内容位置 | `content/posts/<slug>/`、`content/projects/<slug>/`（目录名即 slug） |
| 代码位置 | `app/`（路由、组件、lib、样式）；根目录三个配置文件 `vite.config.ts` / `react-router.config.ts` / `velite.config.ts` |
| 部署   | push 到 `main`（默认分支）→ GitHub Actions → GitHub Pages |
| **范围** | **只做对外展示。文章推送到公众号/知乎是另一个项目，不在本仓库** |

**一句话判断标准**：任何改动，如果让"写一篇文章"变慢、或让"维护"变重，就是错的方向。

## 2. 开工前必读

不要凭印象改。按任务类型查对应文档，**只读需要的那几份**：

| 你要做的事                | 必读                                  |
| -------------------- | ----------------------------------- |
| 改页面结构 / 加路由 / 改字段    | `docs/02-Product-Requirements.md`   |
| 加 / 改项目展示（含 repo / docs / demo 链接） | `docs/02` §4 项目与 §5 内容模型，字段真源在 `velite.config.ts` |
| 改颜色 / 字号 / 间距 / 组件样式 | `docs/03-Design-System.md`（先看文首的现状说明）  |
| 改构建配置 / 加依赖 / 动 lib  | `docs/04-Technical-Architecture.md` |
| 判断某功能该不该做            | `docs/01-Project-Brief.md` §3 非目标   |
| 想知道某个设计为什么这样         | `docs/06-Decision-Log.md`           |
| 决定"接下来做什么"           | `docs/05-Development-Roadmap.md`    |
| 拿不准一个词在本仓库指什么        | `GLOSSARY.md`                       |

## 3. 命令

```bash
pnpm install
pnpm dev       # http://localhost:5173，草稿与未来日期的文章都可见
pnpm content   # 只重建内容层（.velite/），不启服务
pnpm validate  # 只跑跨文件校验（规则 3–6），不构建
pnpm test      # node:test 回归，对象是 scripts/lib/content-rules.mjs
pnpm check     # react-router typegen + tsc --noEmit，类型检查
pnpm build     # 内容层 → validate → typegen → tsc → react-router build → postbuild；这是唯一的验收命令
pnpm preview   # 用 scripts/serve.mjs 模拟 GitHub Pages（301 / 404 行为与线上一致）
```

**当前不存在、不要假设存在的命令**：`lint`、`format`、`new`。

`pnpm build` 已经把类型检查与内容校验串进去了，CI 的 `deploy.yml` 不需要也不应该再加单独一步。跑 `pnpm dev` 时类型检查**不会**触发（Vite 只做转译），所以改完 `.ts` / `.tsx` 要自己跑一次 `pnpm check`，别指望热更新报错。

`pnpm preview` **不是** `vite preview`。GitHub Pages 是目录式托管，`vite preview` 不做"缺尾斜杠 301"和"未知路径回落到 `404.html`"，看起来没问题、上线才 404。要改预览行为只改 `scripts/serve.mjs`。

加依赖仍需先过 `docs/04` §6 的三问；`typescript` 是已批准的 devDependency 例外。lint / format 工具当前没有引入，评估结论与触发条件写在 `docs/05` 当前计划里；要加先在 `docs/06` 立一条决策。

## 4. 硬约束（违反即回退，不接受"更现代的做法"）

### 4.1 视觉

这六条只约束**新增与被改动的样式**。`garden.css` / `garden-themes.css` 这一层与它们有出入，出入项记在 `docs/04` §7 的偏差登记里：保留、不追认，也别在做别的任务时顺手迁移——视觉收敛是 `docs/05` 的独立待办。

1. **层级靠排版**：字号、字重、灰度、留白。卡片、阴影、毛玻璃、渐变属于偏差登记那类做法，新样式不引入。
2. **强调色只给可点击的东西和关键结论**，装饰性着色一律禁止。当前是六套主题（`app/lib/theme.ts` 的主题数组是唯一真源），每套的明暗成对值写在 `app/styles/garden-themes.css` / `global.css` 对应的 `[data-theme]` 块里；新增主题就在那两处补齐，并保证正文对比度 ≥ 4.5:1。
3. **色值只写在 `app/styles/` 的 token 定义处**（`global.css` 的 `:root` 与各主题的 `[data-theme]` 块）。组件与路由样式里出现 `#` 开头的字面色值即为违规——代码块窗口的三个圆点是唯一例外。
4. **圆角只用三档**：`0` / `2px`（行内代码、图片）/ `6px`（代码块窗口）。
5. **标签是纯文字 `#tag`**，不做胶囊、不做色块。
6. **焦点环始终可见**：`2px solid var(--accent)`；只有在同时给出等效可见替代时才允许 `outline: none`。

### 4.2 URL 与路由

1. 所有页面 URL **带尾斜杠**，产物是 `build/client/<path>/index.html`。手写链接必须写成 `/posts/xxx/`。
   - 这不是一个开关：静态路由要同时进 `app/routes.ts` 和 `react-router.config.ts` 的 `prerender` 数组；动态路由（文章、项目、标签、系列）由 `.velite` 内容推导，不用手加。漏加的表现是本地 dev 正常、线上 404。
2. **slug 一经发布永不修改**，URL 里不出现日期，中文不进 URL。
3. 不要引入 `/notes`、`/search`、`/archive`、`/en`、分页路由，也不要引入任何"发布状态"页。

### 4.3 内容

1. 只有**两种**内容实体：**Post** 与 **Project**。不要新增 Note / Author / Task collection。
2. Project 不进 RSS、不进标签、**没有 `date`**；它不是 Post 的分类，也不属于任何 Series。
3. `summary` 必填，20–160 字，它同时是列表摘要和 `meta description`。
4. 正文**不用 `h1`**（标题由 `title` 渲染），标题从 `h2` 起，不跳级。
5. 图片与文章同目录，用相对路径引用，`alt` 必填。
6. **构建期校验失败即构建失败**，不允许降级成 warning。

### 4.4 依赖与性能

1. **不引入第三方主题、UI 框架、CSS-in-JS、动画库、图标库、日期库。** 图标内联 SVG（见 `app/components/Icon.tsx`）。
2. 新增依赖前先过三问（见 `docs/04` §6）。答不出来就不加。
3. 首屏 JS 预算 ≤ 130KB（gzip）——这是换框架付出的唯一硬成本（ADR-0011），**只能降不能涨**。当前实测数字记在 `docs/04` §6，本文件不复制一份；让预算变紧的改动要在提交信息里给出新数字和理由。
4. **不要撤销这三个已测过的优化**，除非你有新的 Lighthouse 数据：
   - `scripts/postbuild.mjs` 内联全部 CSS（**并保留** `build/client/assets/*.css`，路由清单仍引用它们，删了客户端导航就掉进 ErrorBoundary）
   - `routeDiscovery: { mode: 'initial' }`（把路由表写进 HTML，静态托管没有 `/__manifest` 端点）
   - 删除 `text-rendering: optimizeLegibility`  
     理由见 `docs/06` §1 与 `docs/04` §4 与 §6。

## 5. 代码规范

### 5.1 通用

- TypeScript **strict**（`tsconfig.json` 显式开启，含 `noUncheckedIndexedAccess`）。不写 `any`，确实需要时用 `unknown` + 收窄。
- 不写 `// @ts-ignore`。类型不对就是设计不对。
- 不引入 `console.log` 作为调试残留；构建脚本里的输出用 `console.error` 并带退出码。
- 不做与任务无关的重构、格式化、重命名。**一个 PR 只做一件事。**

### 5.2 文件与命名

| 类型       | 约定                   | 例                                    |
| -------- | -------------------- | ------------------------------------ |
| 路由模块     | 一个 URL 一个文件；页面私有布局写进 `app/styles/`，CSS Modules 尚未引入 | `app/routes/post.tsx`                |
| 组件       | PascalCase，一个文件一个组件  | `app/components/PostRow.tsx`         |
| lib 模块   | kebab-case，纯函数优先     | `app/lib/reading-time.ts`            |
| 路由表      | 显式声明，不用文件路由约定        | `app/routes.ts`                      |
| 内容目录     | kebab-case，即 slug    | `content/posts/hello-world/`         |
| CSS 类    | kebab-case，BEM 风格修饰符 | `.featured__title`                   |

### 5.3 路由模块与组件

- 路由模块只做三件事：取内容、`meta` 出 SEO 标签、渲染。取内容一律经 `app/lib/content.ts`，不在页面里直接 import `.velite` 的 json——那会把发布过滤复制成第二份。
- `meta` 返回 `MetaDescriptor[]`；canonical 写成 `{ tagName: 'link', rel: 'canonical', href }`。**不要用 `links`**——预渲染时 `links()` 是无参调用的，类型对不上。
- 页面私有的**布局**写在 `app/styles/` 的对应文件里；颜色一律 `var(--*)`。
- 全局元素样式（`prose`、`table`、`pre`）放 `app/styles/global.css`，不要散落在组件里。
- 需要交互就用原生 `useState` / `useEffect` / `useLayoutEffect`；不引入状态管理、动画、UI 库。
- 内容正文是**构建期渲染好的 HTML**（Velite 的 `html` 字段），不要在文章里塞需要 hydrate 的 React 组件。

### 5.4 内容过滤

- **发布判定只有一处**：`app/lib/publish.ts` 的 `isPublished()`。页面和 `react-router.config.ts` 的 prerender 清单都调它，不要在页面里重新实现"非草稿 + 日期已到"。
- 内容排序与发布过滤集中在 `app/lib/content.ts`；新增分组或计数需求先提供共享纯函数，不恢复无人使用的 `posts.ts`。

### 5.5 注释

- 注释解释**为什么**，不解释**是什么**。`// 遍历 posts` 是无用注释。
- 每个非显然的取舍留一句理由，尤其是"看起来可以优化但故意没优化"的地方。
- 中文注释，与现有代码一致。

## 6. 内容规范

写文章时遵守 `docs/02` §5.4：

- 代码块必须标语言；图片必须有 `alt`；外链用完整 `https://`；站内链接用根相对路径。
- 中文段落不用斜体；强调用 `--accent` 或 600 字重。
- 每篇至少一个可被引用的结论句，放进 `summary`。
- `updated` 只在**实质性修改**时填，改错别字不填。

**Agent 代写内容时的额外要求**：不要凭空生成"项目经历"。`lattice` 相关的事实来自用户提供的材料，缺细节就问，不要补。

## 7. 文档维护规则

**改行为必须同步改文档，同一个提交内完成。** 这是硬性要求，不是建议。

| 你改了什么                 | 必须同步                                |
| --------------------- | ----------------------------------- |
| frontmatter 字段 / 校验规则 | `docs/02` §5.3、§5.5                 |
| 校验规则实现 / 测试用例        | `scripts/lib/content-rules.mjs` 与 `tests/` 同步改，`docs/04` §2 |
| 路由 / 页面结构 / 导航        | `docs/02` §2、§3、§4                  |
| 颜色 / 字号 / 间距 / 组件规格   | `docs/03`                           |
| 目录结构 / 依赖 / 构建流程 / 部署 | `docs/04`                           |
| 里程碑完成 / 新增待办          | `docs/05`                           |
| 任何有代价的技术选择            | `docs/06` + 新建 `docs/adr/000N-*.md` |
| 新增术语                  | `GLOSSARY.md`                       |

另外两条：

- **`docs/06` 只追加，不改写。** 推翻旧决策时新增一条并标注"取代 000x"，旧条目原文保留。
- **不要制造第二份真源。** schema 只在 `velite.config.ts` 定义，文档里描述意图而不复制代码。

## 8. 提交规范

格式：`<type>: <中文短句，不超过 50 字>`。type 取自实际在用的集合：

| type    | 用于              |
| ------- | --------------- |
| `feat`  | 新页面、新组件、新能力     |
| `fix`   | 修 bug           |
| `perf`  | 性能相关（必须能说出指标变化） |
| `a11y`  | 无障碍             |
| `post`  | 只增改文章内容         |
| `docs`  | 只改文档            |
| `chore` | 配置、依赖、CI        |

规则：

- 一个提交只做一件事。文档同步跟着对应提交走，不单独拆。
- 不写 `update` / `修改` 这类无信息量的描述。
- 不 `--amend` 已推送的提交；不 `--no-verify`。

## 9. 标准工作流

```
1. 读  → 本文档 + §2 表里对应的文档
2. 查  → 相关源码（不要猜实现，先读 velite.config.ts / app/lib / app/routes 下的目标文件）
3. 改  → 最小改动；一次只碰一个关注点
4. 验  → pnpm test + pnpm build 必须通过（build 已含 validate 与 tsc）
        视觉改动另加：375px 无横向滚动 + 键盘可走完
5. 记  → 按 §7 同步文档；有取舍则补 docs/06
```

第 4 步失败时**不要**通过放宽校验、加 `try/catch` 吞掉错误、或跳过检查来"修好"。修根因。

## 10. 越界即停

§4 已经正面写过的事不再重复；这里是几条会把项目带偏方向的边界，每条都给出该走的路：

- **发布到外部平台**（公众号 / 知乎推送管线）→ 那是另一个仓库。动手前先确认没走错项目。
- **Tailwind / shadcn / 任何 UI 组件库** → 它们是 ADR-0011 记下的"视觉重做上限"，不是当前依赖。要引入先在 `docs/06` 立一条决策，写清它解决哪个具体视觉问题，并保留 §4.1 的六条。
- **视觉预设（`preset`）与主题层的关系** → 六套 `theme` 是已实现的现状（偏差登记在册）；`preset` 那层仍不做，将来做也只换 token、不换布局（见 GLOSSARY 与 ADR-0003）。
- **第三种内容实体**（Note / Author / Task）→ 站内只有 Post 与 Project；短想法留在个人笔记工具里（ADR-0005）。
- **`pnpm add` / 升级 React 或 React Router 大版本** → 先过 §4.4 的三问并取得确认。
- **`deploy.yml` 的部署目标** → GitHub Pages 是 ADR-0006 的结论，只监听 `main`。
- **批量重排格式、批量重命名文件、编辑生成目录**（`build/`、`node_modules/`、`.react-router/`、`.velite/`）→ 每个改动都要能一句话说清为什么。

## 11. 已知坑

| 坑              | 说明                                                                                            |
| -------------- | --------------------------------------------------------------------------------------------- |
| GitHub 连不上       | 本机 HTTPS 到 GitHub 会 502，也可能报 `error adding trust anchors`（Git 自带的 ca-bundle 路径已失效）。走 SSH：`git fetch git@github.com:unraveltao/unraveltao.github.io.git main`，推送同理 |
| 只有 `main` 会上线    | 默认分支是 `main`，`deploy.yml` 只监听它。远端还留着 `react-rewrite` / `ui/garden` / `ui/garden-archive` 三个旧分支，往它们推不会上线，也别当成"已删除"来写文档 |
| 尾斜杠            | GitHub Pages 是目录式托管，缺尾斜杠会 301。React Router 的产物是 `X.html`，`postbuild.mjs` 改写成 `X/index.html`；手写内链必须带 `/`。用 `pnpm preview` 验证，别用 `vite preview` |
| `data-theme` 被抹掉 | React 会移除 `<html>` 上的未知属性，内联脚本写进去的 `data-theme` 在 hydration 时丢失，主题回退成默认的 Spring。`app/root.tsx` 靠 `suppressHydrationWarning` + `useLayoutEffect` 重新应用，**两处都不能删** |
| 站内跳转变 404    | `react-router.config.ts` 必须 `routeDiscovery: { mode: 'initial' }`。默认 `lazy` 会去请求 `/__manifest`，静态托管上没有这个端点，每次客户端导航都掉进 ErrorBoundary |
| postbuild 删 CSS 会坏导航 | 内联 CSS 之后**必须保留** `build/client/assets/*.css`——路由清单仍引用这些文件名，删了不影响首屏但会让客户端导航加载失败 |
| `.velite` 被清空    | Velite 的 `output.clean` 已关掉：`react-router.config.ts` 在构建期直接读 `.velite/*.json`，清空会让它 ENOENT。别"顺手"打开 |
| `series` 拼错 | 现在会构建失败（`scripts/validate-content.mjs` 规则 4）。但 `app/lib/series.ts` 仍保留 `?? key` 回退——那是给运行时兜底的，不要依赖它 |
| 文档与代码的落差       | `docs/04` §7 是偏差登记（六套主题与卡片样式、无 lint、OG 单图、无 `pnpm new`…）。动手前先看一眼，别把"文档写了"当成"代码有了"，也别把"代码有了"当成"规范追认了" |
| 校验规则用 `key in obj` | 会走原型链——`series: constructor` 能静默通过规则 4。判自有键一律用 `Object.hasOwn`，回归用例在 `tests/content-rules.test.mjs` |
| 在 `pnpm dev` 里等类型报错 | Vite 只转译不检查，类型错误只在 `pnpm check` / `pnpm build` 出现 |
| 主题闪烁           | 主题脚本必须内联在 `<head>` 且同步执行（`app/lib/theme.ts` 的 `THEME_INIT`），挪到 `defer` 或外部文件会闪白                                                  |
| 两个项目别混         | 文章推送管线（公众号/知乎）**不是本项目**。看到相关需求，先确认是不是走错了仓库                                                  |

## 12. 交付前自检

- [ ] `pnpm test` 通过
- [ ] `pnpm build` 通过（含 `validate` 与 `tsc --noEmit`）
- [ ] 首屏 JS 没有超过 130KB（gzip），并把新数字记进 `docs/04` §6
- [ ] 没有新增依赖（或已说明理由）
- [ ] 没有字面色值逃出 `app/styles/` 的 token 定义处
- [ ] 新增样式没有卡片 / 阴影 / 胶囊标签，焦点态可见
- [ ] 内链带尾斜杠
- [ ] 改动的行为已在对应文档里同步（§7 表）
- [ ] 有代价的取舍已记入 `docs/06`
- [ ] 提交信息符合 §8

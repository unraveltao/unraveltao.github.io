# 设计系统

> 适用：全站。所有取值以 CSS 自定义属性落地，组件只消费 token，不写字面色值。
> 决策来源：ADR-0003（视觉延续 README 身份）。

## 1. 四条原则

1. **文字承担全部层级**——用字号、字重、灰度、留白分级，不用色块、卡片、阴影。
2. **一个强调色，只给可点击的东西和关键结论**。装饰性着色一律禁止。
3. **直角优先**。圆角只出现在行内代码与图片（2px），其余为 0。
4. **中文优先排版**。行高、行宽、标点处理按中文阅读节奏定，英文是"顺带好看"。

## 2. 色彩

### Light（默认）

| Token | 值 | 用途 | 对比度 |
|---|---|---|---|
| `--bg` | `#FFFFFF` | 页面底色 | — |
| `--surface` | `#F7F7F2` | 行内代码、代码块、引用块底 | — |
| `--ink-900` | `#1A1A17` | 正文、标题 | 17.4:1 on `--bg` |
| `--ink-600` | `#57574F` | 次要文字、导语、摘要 | 7.0:1 |
| `--ink-400` | `#6E6E66` | 日期、标签、页脚等元信息 | 5.1:1 |
| `--line` | `#E6E6DF` | 1px 分隔线、表格线 | — |
| `--accent` | `#0F6E56` | 链接、当前项、强调结论 | 6.2:1 |
| `--accent-strong` | `#0A5340` | 链接 hover / active | 8.4:1 |
| `--accent-wash` | `#EAF3F0` | 文本选区、TOC 当前项底 | — |

### Dark

| Token | 值 | 用途 | 对比度 |
|---|---|---|---|
| `--bg` | `#121211` | 页面底色 | — |
| `--surface` | `#1B1B19` | 代码块、引用块底 | — |
| `--ink-900` | `#EDEDE7` | 正文、标题 | 14.8:1 |
| `--ink-600` | `#A6A69C` | 次要文字 | 7.2:1 |
| `--ink-400` | `#8C8C82` | 元信息 | 5.6:1 |
| `--line` | `#2A2A26` | 分隔线 | — |
| `--accent` | `#4EC3A3` | 链接、当前项 | 8.7:1 |
| `--accent-strong` | `#6FD8BB` | hover / active | 10.9:1 |
| `--accent-wash` | `#17322A` | 选区、TOC 当前项底 | — |

**硬约束**：`#0F6E56` 永远不出现在深色主题里。深色下的 accent 是另一支色，不是同一个色加透明度。

### 主题切换

- 默认跟随 `prefers-color-scheme`；用户手动切换后写 `localStorage['theme'] = 'light' | 'dark'`，并覆盖系统偏好。
- 在 `<html>` 上挂 `data-theme`，token 用 `:root[data-theme='dark']` 覆盖，不用两套 class。
- `<head>` 内联一段同步脚本读 localStorage 设置 `data-theme`，避免首屏闪白。
- 切换控件是文字按钮（`light` / `dark`），不是图标开关——图标在极简界面里是额外的视觉噪音。

## 3. 字体

```
--font-sans: "Inter var", -apple-system, "Segoe UI", "PingFang SC",
             "Noto Sans SC", "Microsoft YaHei", sans-serif;
--font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo,
             Consolas, "Noto Sans Mono CJK SC", monospace;
```

- Inter 与 JetBrains Mono **自托管 woff2，只取 latin 子集**（各 ~30KB）；CJK 一律走系统字体，不下载中文字体包（几 MB 换不回来）。
- `font-display: swap`，`font-feature-settings: "tnum"` 用于日期与数字列。
- **中文不用斜体**。需要强调时用 `--accent` 或 600 字重，`<em>` 在中文段落里降级为强调色。

## 4. 字号阶梯

模块化比例 1.25，基准 17px（中文正文下限，不用 16）。

| Token | 桌面 | 移动 | 行高 | 字重 | 用途 |
|---|---|---|---|---|---|
| `--text-display` | 42px | 32px | 1.15 / 1.2 | 600 | 文章标题、站名 |
| `--text-h2` | 33px | 27px | 1.3 | 600 | 正文 h2 |
| `--text-h3` | 27px | 22px | 1.4 | 600 | 正文 h3 |
| `--text-h4` | 21px | 19px | 1.5 | 600 | 正文 h4、列表项标题 |
| `--text-lead` | 19px | 18px | 1.7 | 400 | 文章导语、首页一句话介绍 |
| `--text-body` | 17px | 17px | **1.75** | 400 | 正文 |
| `--text-small` | 15px | 15px | 1.6 | 400 | 图注、脚注 |
| `--text-meta` | 13px | 13px | 1.5 | 500 | 日期、标签、导航（等宽，`letter-spacing: .06em`） |

标题字距 `letter-spacing: -0.01em`；等宽元信息用 `text-transform: uppercase`（仅拉丁）。

## 5. 排版度量

- **行宽 `--measure: 680px`**。17px 中文一行约 40 字，落在舒适区（30–40 字）上沿；再宽眼睛回行会丢行。
- 正文左对齐，**两端对齐禁用**（中文会出现大片字间空隙）。
- 段落间距 `1.25em`，段首不缩进（网页阅读不用书籍缩进）。
- 标题上间距 > 下间距（`margin-top: 2.5em; margin-bottom: .8em`），让标题归属下文。
- `text-wrap: pretty` 给标题和导语，`text-wrap: balance` 只给 display 级标题。
- 中文标点用全角，代码与数字前后由 `text-spacing` 不可用则手工加细空格（`.125em`）。

## 6. 间距 / 圆角 / 描边 / 阴影

- 间距阶梯（4 基准）：`4 8 12 16 24 32 48 64 96 128`。
- 区块垂直节奏：小节之间 64，大区块之间 96，移动端折半。
- 圆角：`--radius: 0`；`--radius-sm: 2px`（行内代码、图片）；`--radius-window: 6px`（仅代码块窗口）。
- 描边：只用 `1px solid var(--line)`。**没有阴影，没有毛玻璃，没有渐变。**
- 图片：`max-width: 100%`，直角或 2px，`--line` 描边可选；必须有 `alt`。

## 7. 动效

- 时长 `160ms`，缓动 `cubic-bezier(.2, 0, 0, 1)`。
- 只允许动 `opacity`、`transform`、`color`、`border-color`。不动 `height`、`filter`。
- 页面切换不做过渡动画（静态站，别伪装成 SPA）。
- `@media (prefers-reduced-motion: reduce)` 下全部归零。

## 8. 组件规格

### 顶栏 Nav
- 高度 64px，底部 1px `--line`，**滚动后才出现**（首屏无边框）。
- 左侧站名 `--text-meta` 600 字重；右侧链接 3–4 个，`--text-meta`，间距 24px。
- 当前页链接用 `--accent`，其余 `--ink-600`。不做下划线动画。

### 文章列表项（首页 / 归档 / 标签页共用）
- 结构：`日期（等宽 13px，--ink-400）` + `标题（--text-h4，--ink-900）` + `一句话摘要（--text-small，--ink-600，最多 2 行）`。
- 行间距 40px；**项与项之间不加分隔线**，靠留白分组；跨年份时插入一条 `--line` 细线 + 年份标签。
- hover：标题转 `--accent`，`160ms`。整行可点，不加背景色。

### 文章页头
- 标题 `--text-display`；其下 `--text-meta` 一行：日期 · 阅读时长 · 标签（用 `·` 分隔，不用标签胶囊）。
- 导语 `--text-lead`，`--ink-600`，与标题间距 16px。
- 头与正文之间 48px，只在此处出现一条 `--line`（可选）。

### 正文 Prose
- 链接：`--accent`，`text-decoration-thickness: 1px`，`text-underline-offset: 3px`；hover 只把厚度变 2px，**不变色**。
- 列表：`ul` 用 `–` 短横（`::marker` 着色 `--ink-400`）；`ol` 用等宽数字。
- 引用块：左侧 2px `--line`，左内边距 16px，文字 `--ink-600`，**不用斜体**。
- 行内代码：`--surface` 底 + `2px` 圆角 + 0.9em 等宽 + 左右 4px 内边距，**不加描边**。
- 代码块：**macOS 窗口样式**。顶部标题栏（左侧三个 10px 圆点 `#FF5F57 / #FEBC2E / #28C840`，右侧语言标签 `--text-meta` 等宽大写、`--ink-400`），标题栏下方 1px `--line`，整块圆角 `--radius-window`（6px），代码区横向滚动、不折行。
- 这是全站**唯一允许出现第三个色相**的地方：三个圆点是可识别的窗口隐喻，属于刻意例外，不要推广到别处。
- 语法高亮用低饱和的 `min-light` / `min-dark`，色相控制在 5 个以内。
- 表格：只有横线（表头下 1px `--ink-400`，行间 `--line`），无竖线无底色。
- 图片：下方图注 `--text-small` `--ink-400`，居中或左对齐跟随图片宽度。

### 目录 TOC
- 仅 ≥1200px 显示，右栏 200px，与正文间距 48px，`position: sticky` 顶距 96px。
- `--text-meta`，`--ink-400`；当前项 `--accent` + 左侧 2px `--accent` 竖条（`padding-left: 12px`）。
- 层级只显示 h2 / h3，h3 缩进 12px。

### 标签
- 纯文字 + `#` 前缀（等宽），`--ink-600`；hover `--accent`。
- **不做胶囊底色**——圆角色块会立刻把页面拉向 SaaS 风，破坏 ADR-0003。

### 分页 / 上下篇
- 只有"← 上一篇 / 下一篇 →"文字链接，`--text-meta`，中间用 `·` 或留白隔开。不做页码器。

### 页脚
- 一行：版权 · RSS · 源码仓库 · 邮箱，`--text-meta` `--ink-400`，上边距 96px，顶部 1px `--line`。

### 焦点态
- `:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }`
- 禁止 `outline: none`，除非同时给出等效可见替代。

## 9. 无障碍底线

- 所有文字对比度 ≥ 4.5:1（13px 的元信息也算「小字」，不能套用 3:1 的宽松档），正文目标 ≥ 7:1。
- 移动端正文不小于 17px；可点区域不小于 44×44（列表整行可点已满足）。
- 所有交互可用键盘完成，Tab 顺序与视觉顺序一致。
- 语义结构：每页一个 `<h1>`，标题层级不跳级；`<nav>` / `<main>` / `<article>` / `<footer>` 齐备。
- 图片 `alt` 必填；纯装饰图 `alt=""`。

## 10. 尚未确定（等 IA 定稿后补）

- 首页"精选轨"的视觉权重：是置顶一篇，还是独立一条横向区。
- 列表页是否需要"年份分组"折叠交互（当前设计为静态分组，不折叠）。
- 搜索框样式（若 v1 引入 Pagefind）。

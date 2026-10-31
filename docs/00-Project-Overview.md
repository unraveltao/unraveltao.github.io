# 项目概览

> 这是文档集的入口页。它只回答"这是什么、现在到哪了、要深入时该翻哪份"。
> 最后更新：2026-10-31

## 1. 一句话

一个**以工程叙事为主的静态个人站**：用 MDX 写作、commit 即发布、零后端、零卡片、单一强调色。它有两块内容——把 `lattice` 这类项目的设计取舍讲清楚（文章），以及让人一眼看到做过什么（项目展示）。

线上地址：<https://unraveltao.github.io>

### 1.1 范围边界（重要）

**本仓库只做"对外展示"这一件事。** 有一个容易混淆的邻居，必须先划清：

| | 本仓库 | 另一个项目 |
|---|---|---|
| 是什么 | 静态展示站 | 文章推送管线（公众号 / 知乎 / 头条…） |
| 怎么跑 | `git push` → GitHub Actions → Pages | 本机 `node pub_wx_publish.js`，浏览器自动化 |
| 有什么 | 文章、项目、关于 | 物料包、台账、质检、平台适配器 |
| 共享什么 | **只可能共享同一篇文章的文本**，不共享代码、部署、数据 | |

推送管线**不属于本项目**，它的文档在它自己那边。本站的"发布"只有 `git push` 一个含义（见 [GLOSSARY](../GLOSSARY.md) 的 `publish` 词条）。

## 2. 读者与成功定义

| 项 | 内容 |
|---|---|
| 主要读者 | 同行工程师——看设计取舍，不看教程步骤 |
| 次要读者 | 招聘方——五分钟内判断技术判断力 |
| 成功的定义 | 三个月后还有新文章，且每篇都有一个可被引用的结论 |

**不是**面向搜索引擎的内容农场，**不是**教程站，**不是**知识库。这条定位决定了后面所有取舍（见 [ADR-0001](./adr/0001-blog-positioning.md)）。

## 3. 当前状态（2026-10-31）

| 维度 | 状态 |
|---|---|
| 阶段 | M0 骨架、M1 内容管线、M2 上线、M3 项目展示均已完成 |
| 文章 | `content/posts/` 下 4 篇（含 1 篇 `featured`、1 个系列 2 篇） |
| 项目展示 | `/projects` 与 `/projects/lattice/` 已上线，1 个项目 |
| 构建产物 | 18 个 HTML 页面 + RSS + sitemap + OG 图 |
| 线上性能 | 迁移前（Astro 构建）文章页移动端 99/100/100/100、首屏 JS 0 个请求；迁移后首屏 JS **121.8KB gzip**，Lighthouse 待重测 |
| 工具链 | `validate` / `check` / `test` 均在 `pnpm build` 或提交前生效 |
| 主要缺口 | 无 lint / 格式化；OG 图是单张静态图；无 `pnpm new` 脚手架；`why-astro-mdx` 一文仍在讲旧栈 |

详细进度与待办见 [05-Development-Roadmap.md](./05-Development-Roadmap.md)。

## 4. 技术栈

| 层 | 选型 | 一句话理由 |
|---|---|---|
| 框架 | Vite 7 + React 19 + React Router 7（`ssr: true` + 全站预渲染） | 熟悉的模型，可扩展性优先；零 JS 的收益让位于此（[ADR-0011](./adr/0011-vite-react-router.md)） |
| 内容 | Markdown 存仓库 + Velite 内容层 | 可被 git 审阅、被编辑器与 agent 直接读写（[ADR-0002](./adr/0002-mdx-in-repo.md)） |
| 校验 | zod schema（`velite.config.ts`） | 构建期拦住 frontmatter 错误 |
| 样式 | 原生 CSS + CSS Modules + 自定义属性 | 无 CSS 框架；Tailwind / shadcn 记为未来视觉重做的**目标上限**，当前未引入 |
| 高亮 | Shiki（`min-light` / `min-dark`） | 低饱和，色相可控 |
| 部署 | GitHub Pages + Actions | 用户站点在根路径，不需要 `base`（[ADR-0006](./adr/0006-github-pages.md)） |

## 5. 五条不可协商的约束

1. **只有两种内容实体：Post 与 Project**。没有 Note、没有 Author、没有多作者（[ADR-0007](./adr/0007-project-as-second-entity.md)）。
2. **零卡片、零阴影、单一强调色 `#0F6E56`**（深色主题换 `#4EC3A3`）。
3. **URL 带尾斜杠、无日期、slug 发布后永不修改**。
4. **构建期校验失败即构建失败**，不允许"警告但继续"。
5. **不引入第三方 UI / 主题 / 动画 / 图标库**，图标一律内联 SVG。

## 6. 文档地图

| 想知道什么 | 看这份 |
|---|---|
| 项目是什么、现在到哪了 | **00-Project-Overview.md**（本文） |
| 为什么做、边界在哪、成功怎么衡量 | [01-Project-Brief.md](./01-Project-Brief.md) |
| 有哪些页面、字段怎么填、验收标准 | [02-Product-Requirements.md](./02-Product-Requirements.md) |
| 颜色、字号、间距、组件长什么样 | [03-Design-System.md](./03-Design-System.md) |
| 代码怎么组织、怎么构建、怎么部署 | [04-Technical-Architecture.md](./04-Technical-Architecture.md) |
| 做完了什么、接下来做什么 | [05-Development-Roadmap.md](./05-Development-Roadmap.md) |
| 某个决定当初为什么这么定 | [06-Decision-Log.md](./06-Decision-Log.md) |
| 术语（Post / Series / Featured / Draft） | [../GLOSSARY.md](../GLOSSARY.md) |
| Agent 干活时该守什么规矩 | [../AGENTS.md](../AGENTS.md) |

## 7. 本地快速开始

```bash
pnpm install
pnpm dev      # http://localhost:5173
pnpm build    # 输出 build/client/
pnpm preview  # 模拟 GitHub Pages 预览
```

写作与发布流程见 [02-Product-Requirements.md §7](./02-Product-Requirements.md#7-写作流程)。

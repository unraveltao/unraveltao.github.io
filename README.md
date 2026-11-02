# unraveltao — 个人主页与作品集

> 把想法做成项目，把经验沉淀成方法。

这里展示我在做的项目，以及值得长期保留的方法论、技术取舍与实践总结。全站构建期渲染成静态 HTML，push 到 `main` 即发布；没有后端、数据库或 CMS。

**Live site:** <https://unraveltao.github.io> · **定位与边界:** [docs/01-Project-Brief.md](docs/01-Project-Brief.md)

## Features

| 能力 | 现在实际是什么 |
| --- | --- |
| 首页 | 个人介绍 → 代表项目（`order` 第一项）→ 精选写作（`featured`，没有精选就整块隐藏） |
| 作品集 | `/projects/` 列表与详情；详情按 `repo` / `docs` / `demo` 字段显示对应外链，缺项不渲染；正文后自动关联 `Post.project` 命中的已发布文章 |
| 写作 | `/posts/` 日期倒序，标签筛选 + 关键词过滤都在客户端做；文章页有目录、阅读时长、系列导航（超过一篇才显示）与 Markdown 下载入口 |
| 系列 | `/series/:name/`，名称与说明在 `content/series.json` |
| 站内检索 | 顶栏搜索（`Ctrl` / `⌘ + K`），原生 `<dialog>`，前端过滤已发布文章与项目 |
| 六套外观 | Spring / Summer / Autumn / Winter / Geeker / Hacker；存 `localStorage`，`<head>` 内同步脚本避免首屏闪白 |
| 静态产物 | RSS、sitemap、robots、canonical 与 OG；所有 URL 带尾斜杠，配合 GitHub Pages 的目录式托管 |
| 旧地址 | `/workshop/`、`/workflow/` 保留原 URL，已退出主导航与首页 |

## Tech Stack

- **Vite 7 + React Router 7**（framework mode，`ssr: true` + 构建期 prerender 清单）
- **React 19 + TypeScript strict**（含 `noUncheckedIndexedAccess`、`noUnusedLocals`）
- **Velite 0.4** 内容层：MDX + zod schema，`strict` 让字段错误直接终止构建
- **Shiki** 双主题高亮，加一个自写的 code-window rehype 插件
- **node:test** 跑跨文件内容校验规则的回归
- 样式是手写 CSS 自定义属性；没有 UI 框架、CSS 库、图标库、状态管理或动画库，图标全部内联 SVG

## Quick Start

```bash
pnpm install
pnpm dev        # http://localhost:5173，草稿与未来日期的文章都可见
```

| 命令 | 作用 |
| --- | --- |
| `pnpm content` | 只重建内容层（`.velite/`），不启服务 |
| `pnpm validate` | 只跑跨文件校验，不构建 |
| `pnpm test` | 校验规则的 node:test 回归 |
| `pnpm check` | 类型检查（`react-router typegen` + `tsc --noEmit`）；`pnpm dev` 不会触发它 |
| `pnpm build` | 唯一的验收命令：内容 → 校验 → 类型 → 预渲染 → postbuild |
| `pnpm preview` | 用 `scripts/serve.mjs` 模拟 GitHub Pages 的 301 与 404 行为 |

预览请用 `pnpm preview`，不要用 `vite preview`：后者不做缺尾斜杠的 301 和未知路径回落到 `404.html`，本地看着正常、上线才 404。

## Documentation

| 文档 | 内容 |
| --- | --- |
| [docs/00-Project-Overview.md](docs/00-Project-Overview.md) | 文档入口：该翻哪一份 |
| [docs/01-Project-Brief.md](docs/01-Project-Brief.md) | 定位、目标、内容取舍、成功标准 |
| [docs/02-Product-Requirements.md](docs/02-Product-Requirements.md) | 页面与 URL、导航、内容模型与校验规则 |
| [docs/03-Design-System.md](docs/03-Design-System.md) | 设计规格；文首标明了与当前实现的偏差 |
| [docs/04-Technical-Architecture.md](docs/04-Technical-Architecture.md) | 维护说明：目录职责、构建与部署、性能数字、偏差登记 |
| [docs/05-Development-Roadmap.md](docs/05-Development-Roadmap.md) | 当前计划，以及保留的历史记录 |
| [docs/06-Decision-Log.md](docs/06-Decision-Log.md) · [docs/adr/](docs/adr/) | 决策索引与单条记录（只追加，不改写） |
| [AGENTS.md](AGENTS.md) | 行为边界：硬约束、标准工作流、交付前自检 |
| [GLOSSARY.md](GLOSSARY.md) | 术语：Post / Project / Featured / theme / preset … |

## Development & Contribution

改代码前先读 [AGENTS.md](AGENTS.md)：§2 按任务类型给出必读文档，§4 是硬约束，§7 规定**改行为必须在同一个提交里同步改文档**。

提交信息格式 `<type>: <中文短句>`，type 取自 `feat` / `fix` / `perf` / `a11y` / `post` / `docs` / `chore`；一个提交只做一件事。

只有 `main` 会上线（`deploy.yml` 只监听它，Node 22 + pnpm 9，跑 `pnpm test` 与 `pnpm build`）。本机 HTTPS 到 GitHub 可能 502 或报 CA 锚点错误，走 SSH：

```bash
git push git@github.com:unraveltao/unraveltao.github.io.git main
```

写作规范见 [docs/02](docs/02-Product-Requirements.md) §5：图片与内容同目录、`summary` 必填、slug 发布后永不修改。项目事实、截图与成果只使用作者提供的材料，不由 agent 补造。

本仓库暂无 LICENSE 文件。

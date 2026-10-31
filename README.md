# Blog

一个以工程叙事为主的静态个人博客。Vite + React Router 全站预渲染，commit 即发布，无后端。

**线上**：<https://unraveltao.github.io>
**状态**：M0 骨架、M1 内容管线、M2 上线、M3 项目展示均已完成（`pnpm build` 产出 18 个页面），4 篇文章、1 个项目。

## 目录结构

```
blog/
├── AGENTS.md           # Agent 开发行为规范、代码规范、项目约束
├── README.md           # 本文件：介绍、安装、运行
├── docs/               # 项目文档（00–06 + adr/）
├── app/                # 路由、组件、lib、样式
├── content/            # 文章（posts/）、固定页（pages/）、系列表（series.json）
├── public/             # favicon / og.png / robots.txt
├── scripts/            # 内容校验、构建后处理（内联 CSS / RSS / sitemap）、预览服务
├── tests/              # node:test 回归
├── velite.config.ts    # 内容层：schema + Markdown 管线
├── react-router.config.ts  # 预渲染清单
└── .github/workflows/  # 构建并发布到 GitHub Pages
```

## 文档

| 文档 | 内容 |
|---|---|
| [docs/00-Project-Overview.md](docs/00-Project-Overview.md) | **入口**：项目是什么、现在到哪了、该翻哪份 |
| [docs/01-Project-Brief.md](docs/01-Project-Brief.md) | 为什么做、目标与非目标、成功标准、风险 |
| [docs/02-Product-Requirements.md](docs/02-Product-Requirements.md) | 路由、页面规格、内容模型、校验规则、验收 |
| [docs/03-Design-System.md](docs/03-Design-System.md) | 颜色/字号/间距 token 与组件规格 |
| [docs/04-Technical-Architecture.md](docs/04-Technical-Architecture.md) | 目录、模块职责、构建流水线、部署、技术债 |
| [docs/05-Development-Roadmap.md](docs/05-Development-Roadmap.md) | 里程碑状态与下一步优先级 |
| [docs/06-Decision-Log.md](docs/06-Decision-Log.md) | 决策索引与代价；单条记录在 [docs/adr/](docs/adr/) |
| [AGENTS.md](AGENTS.md) | 改代码前必读：硬约束与禁止事项 |
| [GLOSSARY.md](GLOSSARY.md) | 术语表：Post / Series / Tag / Featured / Draft |

## 核心约束

- 只有两种内容类型：**Post** 与 **Project**（Project 不进 RSS、不进标签）
- URL 里没有日期，slug 发布后永不修改，全站带尾斜杠
- 零卡片、零阴影、单一强调色 `#0F6E56`（深色换 `#4EC3A3`）
- 构建期校验失败即构建失败
- 不引入第三方 UI / 主题 / 动画 / 图标库

## 本地运行

```bash
pnpm install
pnpm dev       # http://localhost:5173，草稿可见
pnpm validate  # 跨文件内容校验（不构建）
pnpm test      # 校验规则的回归测试
pnpm check     # 类型检查（react-router typegen + tsc）
pnpm build     # 内容层 → validate → tsc → 预渲染 → postbuild，输出 build/client/
pnpm preview   # 模拟 GitHub Pages 预览 build/client/（http://localhost:4321）
```

> `lint` / `format` / `new` 尚未接入，见 [docs/05](docs/05-Development-Roadmap.md)。
> 预览请用 `pnpm preview`，不要用 `vite preview`——后者不做尾斜杠 301 与 `404.html` 回落，看不出线上会坏的地方。

## 写作

```bash
# 新建 content/posts/<slug>/index.mdx，字段见 docs/02 §5.3
pnpm dev                                   # 草稿可见
git add . && git commit -m "post: <标题>"
git -c http.proxy= -c https.proxy= push    # 本机代理到 GitHub 会 502
```

push 到 `main` 后由 GitHub Actions 构建并发布。

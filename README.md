# unraveltao — 个人主页与作品集

静态个人网站：展示项目、精选写作和 Personal OS。文章使用 Markdown / MDX，push 到 `main` 后由 GitHub Actions 构建并部署到 GitHub Pages。

## 启动与预览

要求 Node.js 22、pnpm 9。

```bash
pnpm install
pnpm dev
```

开发地址为 <http://localhost:5173>。验收构建并模拟 GitHub Pages 的尾斜杠与 404 行为：

```bash
pnpm test
pnpm build
pnpm preview
```

## 新增文章

1. 新建 `content/posts/<稳定的英文slug>/index.mdx`。
2. 写入标题、20–160 字摘要、日期和 1–3 个 kebab-case 标签。
3. 正文从 `##` 开始；代码块标注语言，站内链接使用带尾斜杠的根相对路径。
4. 图片放在文章目录，以相对路径引用并填写 `alt`。
5. 本地预览，运行上面的测试和构建命令。

最小 frontmatter 示例：

```md
---
title: "文章标题"
summary: "用一句明确结论概括文章，长度 20–160 字。"
date: 2024-01-01
tags: [writing]
---

## 第一节
```

字段以根目录 `velite.config.ts` 为准。已发布文章的 slug 和日期不要修改；除非作者明确要求，不删除或覆盖文章。

## 发布 Personal OS 模块

在 `content/posts/<slug>/index.mdx` 新增文章，frontmatter 添加 `series: personal-os` 和正整数 `order`。Personal OS 入口 `/personal-os/` 会按 `order` 自动列出已发布模块及其摘要、更新时间；无需改页面或路由。文章正文仍使用 `/posts/<slug>/` 地址。

`updated` 仅在实质性修改时填写；首次发布可省略，入口会显示文章日期。更新记录写在文章正文中，并明确区分已观察到的效果与待验证内容。

## 图片

文章图片与 `index.mdx` 放在同一目录，例如 `diagram.png`，引用 `![流程示意图](./diagram.png)`。不要把文章图片集中到另一个目录；不要省略描述性 `alt`。

## 推送发布

检查 `git status`，只暂存本次相关文件，再提交并推送 `main`。推送后查看 GitHub Actions 的 Pages 部署结果。GitHub HTTPS 连接异常时按 [AGENTS.md](AGENTS.md) 中仓库现行 SSH 远程说明操作。

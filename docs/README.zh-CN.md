# unraveltao — 个人博客与项目作品集

**项目展示我做了什么，文章记录我学到了什么，以及我为什么这样做。**

[访问网站](https://unraveltao.github.io/) · [阅读文章](https://unraveltao.github.io/posts/) · [浏览项目](https://unraveltao.github.io/projects/) · [English](../README.md)

## 浏览内容

### 文章

文章归档收录思考、项目记录、技术决策和实践复盘。目前已发布一篇文章：

- [Hello World](https://unraveltao.github.io/posts/hello-world/)：从重新开始编程和写博客谈起，记录 AI 如何改变作者对创造的理解。分类：Thinking（思考）。

你可以在 [Personal OS](https://unraveltao.github.io/personal-os/) 中按四种已注册分类浏览文章：

| 分类 | 入口 |
|---|---|
| Thinking | [想法与观点](https://unraveltao.github.io/personal-os/thinking/) |
| Review | [实践与复盘](https://unraveltao.github.io/personal-os/review/) |
| Skill | [可复用的方法](https://unraveltao.github.io/personal-os/skill/) |
| Log | [项目与学习记录](https://unraveltao.github.io/personal-os/log/) |

分类表示文章的编辑类型，标签用于描述主题。即使某个分类暂时没有已发布的文章，对应页面也可以访问。

### 项目

- [Computer Science Atlas](https://unraveltao.github.io/projects/computer-science-atlas/) · [源码](https://github.com/unraveltao/Computer-Science-Atlas)：持续建设、相互链接的计算机科学知识地图。
- [Lattice](https://unraveltao.github.io/projects/lattice/) · [源码](https://github.com/unraveltao/Lattice)：面向 Windows 的桌面平台，支持 Web 小组件、插件、权限和 Agent 工作流。
- [Skills](https://unraveltao.github.io/projects/skills/) · [源码](https://github.com/unraveltao/Skills)：面向学习、研究、工程和重复任务的独立 Agent Skills 集合。

## 技术栈

| 领域 | 技术 |
|---|---|
| UI | React 19、React Router 7 |
| 构建 | Vite 8、TypeScript 6 |
| 内容 | Velite 0.4、Markdown 与兼容旧文章的 MDX |
| 托管 | GitHub Pages；Vercel 分支预览 |

文章存放在 `content/posts/<slug>/index.md`，使用 YAML Frontmatter；现有 `.mdx` 文章仍然兼容。项目内容使用 `.mdx`。Velite 在构建时校验内容并生成静态页面。

## 本地运行

环境要求：Node.js 22 和 pnpm 9。

```bash
pnpm install
pnpm dev
```

打开 <http://localhost:5173/>。运行生产构建的检查与预览：

```bash
pnpm test
pnpm build
pnpm preview
```

## 工程文档

- [项目文档索引](00-Project-Overview.md)
- [仓库协作规则](../AGENTS.md)
- [产品需求](02-Product-Requirements.md)
- [设计系统](03-Design-System.md)
- [技术架构](04-Technical-Architecture.md)
- [决策记录](06-Decision-Log.md)
- [English README](../README.md)

<details>
<summary>维护与部署</summary>

GitHub Actions 会在 PR 和推送到 `main` 时运行 `pnpm test` 与 `pnpm build`。推送到 `main` 还会将静态站点部署至 GitHub Pages。Vercel 为分支和 PR 提供预览部署。

本站由个人维护。仓库公开用于展示与参考，不接受代码贡献，也不是受支持的项目模板。

</details>

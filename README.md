<div align="center">

# unraveltao

### Personal Site & Portfolio · 个人网站与作品集

**Build projects. Record what I learn. Keep the useful parts.**<br>
**把想法做成项目，记录学习过程，沉淀值得留下的经验。**

[Visit the site](https://unraveltao.github.io/) · [Browse writing](https://unraveltao.github.io/posts/) · [Explore projects](https://unraveltao.github.io/projects/)

</div>

## About · 关于

This is my personal website for selected software projects and technical writing. It records what I build, the decisions behind it, and lessons I may want to revisit.<br>
这里展示我挑选的软件项目与技术文章，记录我做过什么、为什么这样做，以及以后还想回看的经验。

The site is maintained by one person and does not accept code contributions. The public repository is available for transparency and reference; it is not a starter template or a supported product.<br>
本站由我个人维护，不接受代码贡献。公开仓库仅用于展示和参考，不是模板项目或受支持的软件产品。

## Explore · 浏览内容

- **Writing / 文章** — essays, methods, technical decisions, and project notes. / 思考、方法、技术决策与项目记录。
- **Personal OS / 个人方法** — four editorial views: Thinking, Review, Skill, and Log. / 四个文章入口：思考、复盘、技能与记录。
- **Projects / 项目** — selected work with source, documentation, or demo links when available. / 展示精选项目及可用的源码、文档或演示链接。
- **RSS** — subscribe at [`/rss.xml`](https://unraveltao.github.io/rss.xml). / 通过 RSS 订阅新文章。

## Technology · 技术

The site is a static website built with Vite, React Router, and Velite. Content is stored in the repository and validated during the build. GitHub Actions deploys `main` to GitHub Pages; Vercel provides preview deployments for review.<br>
本站使用 Vite、React Router 和 Velite 构建。内容保存在仓库中并在构建时校验；GitHub Actions 将 `main` 部署到 GitHub Pages，Vercel 为分支提供预览。

## Run locally · 本地运行

Requirements: Node.js 22 and pnpm 9. / 环境要求：Node.js 22 和 pnpm 9。

```bash
pnpm install
pnpm dev
```

The development server runs at <http://localhost:5173>. / 开发服务器默认运行于该地址。

```bash
pnpm test
pnpm build
pnpm preview
```

`pnpm test` runs the validation-rule tests. `pnpm build` validates content and types, prerenders the site, and prepares the static output. `pnpm preview` serves the output with the site's trailing-slash and 404 behavior.<br>
`pnpm test` 运行校验规则测试；`pnpm build` 校验内容和类型并生成静态站点；`pnpm preview` 按站点的尾斜杠与 404 规则预览构建结果。

## Content & maintenance · 内容与维护

Posts live in `content/posts/<slug>/index.md`; new posts use plain Markdown with YAML frontmatter. Existing `.mdx` posts remain supported during migration. Projects live in `content/projects/<slug>/index.mdx`. `velite.config.ts` defines the content schema; published post slugs and dates are stable.<br>
文章存放于 `content/posts/<slug>/index.md`，使用带 YAML Frontmatter 的标准 Markdown；迁移期间仍兼容已有 `.mdx` 文章。项目存放于 `content/projects/<slug>/index.mdx`。内容结构以 `velite.config.ts` 为准，已发布文章的 slug 和日期保持稳定。

See [AGENTS.md](AGENTS.md) for repository rules and [the documentation index](docs/00-Project-Overview.md) for product, design, architecture, maintenance, and decision records.<br>
仓库协作规则见 [AGENTS.md](AGENTS.md)；产品、设计、架构、维护和决策文档见[文档索引](docs/00-Project-Overview.md)。

## Contributors · 参与维护

This site is maintained by [Iron Tom](https://github.com/unraveltao). Codex assists with selected engineering work; the maintainer reviews changes before publication.<br>
本站由 [Iron Tom](https://github.com/unraveltao) 维护。Codex 协助部分工程工作，所有变更由维护者审核后发布。

| Maintainer | AI collaborator |
| --- | --- |
| [Iron Tom](https://github.com/unraveltao) | [<img src="https://avatars.githubusercontent.com/u/267193182?s=80&v=4" alt="Codex GitHub avatar" width="48" height="48"> Codex](https://github.com/codex) |


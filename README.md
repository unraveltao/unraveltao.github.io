<div align="center">

<img src="public/assets/unravel-readme-banner.gif" alt="UNRAVEL — Beyond Boundaries, with cascading green binary rain" width="100%">

<h1>Projects &amp; Writing</h1>

<p><strong>A personal blog and project portfolio.</strong></p>
<p>Projects show what I build. Writing records what I learn and why.</p>

<p>
  🏠 <a href="https://unraveltao.github.io/">Website</a> &nbsp;·&nbsp;
  ✍️ <a href="https://unraveltao.github.io/posts/">Writing</a> &nbsp;·&nbsp;
  🧪 <a href="https://unraveltao.github.io/projects/">Projects</a> &nbsp;·&nbsp;
  🌏 <a href="docs/README.zh-CN.md">简体中文</a>
</p>

</div>

<h2 align="center">🧭 Explore</h2>

<h3 align="center">✍️ Writing</h3>

Start with **[Hello World](https://unraveltao.github.io/posts/hello-world/)** — a return to programming and blogging, and a reflection on how AI changed the author's approach to making things.

Browse the four writing paths in [Personal OS](https://unraveltao.github.io/personal-os/):

<p align="center">
  💭 <a href="https://unraveltao.github.io/personal-os/thinking/">Thinking</a> ·
  🔎 <a href="https://unraveltao.github.io/personal-os/review/">Review</a> ·
  🧰 <a href="https://unraveltao.github.io/personal-os/skill/">Skill</a> ·
  📝 <a href="https://unraveltao.github.io/personal-os/log/">Log</a>
</p>

<p align="center"><sub>Ideas · reflection · reusable methods · project notes</sub></p>

<h3 align="center">🛠️ Projects</h3>

| Project | What it is |
|---|---|
| 🧠 **[Computer Science Atlas](https://unraveltao.github.io/projects/computer-science-atlas/)** · [source](https://github.com/unraveltao/Computer-Science-Atlas) | A growing, linked map of computer science topics. |
| 🪟 **[Lattice](https://unraveltao.github.io/projects/lattice/)** · [source](https://github.com/unraveltao/Lattice) | A Windows desktop platform for web widgets, plugins, permissions, and agent workflows. |
| 🧩 **[Skills](https://unraveltao.github.io/projects/skills/)** · [source](https://github.com/unraveltao/Skills) | Installable Agent Skills for learning, research, engineering, and repeatable tasks. |

<h2 align="center">🚀 Run locally</h2>

Requirements: **Node.js 22** and **pnpm 9**.

```bash
pnpm install
pnpm dev
```

Open <http://localhost:5173/>. To run the checks and preview a production build:

```bash
pnpm test
pnpm build
pnpm preview
```

<details>
<summary>📦 Technology and content format</summary>

| Area | Technology |
|---|---|
| UI | React 19, React Router 7 |
| Build | Vite 8, TypeScript 6 |
| Content | Velite 0.4, Markdown and legacy MDX |
| Hosting | GitHub Pages, with Vercel branch previews |

Posts use YAML frontmatter and live in `content/posts/<slug>/index.md`. Existing Post `.mdx` files remain supported. Project pages are authored in `.mdx`. Velite validates content and generates the static pages.

</details>

<details>
<summary>📚 Project documentation</summary>

- [Project overview](docs/00-Project-Overview.md)
- [Repository instructions](AGENTS.md)
- [Product requirements](docs/02-Product-Requirements.md)
- [Design system](docs/03-Design-System.md)
- [Technical architecture](docs/04-Technical-Architecture.md)
- [Decision log](docs/06-Decision-Log.md)
- [中文说明](docs/README.zh-CN.md)

</details>

<details>
<summary>🌱 Maintenance and deployment</summary>

GitHub Actions runs `pnpm test` and `pnpm build` for pull requests and pushes to `main`. Pushes to `main` deploy the static site to GitHub Pages. Vercel provides preview deployments for branch and pull request review.

This is a personally maintained website. The repository is public for transparency and reference; it does not accept code contributions and is not a supported starter template.

</details>

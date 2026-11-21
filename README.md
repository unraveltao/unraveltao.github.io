<div align="center">

# unraveltao

### Personal Site and Portfolio

*A place to share what I build, learn, and think about.*

[Visit the site](https://unraveltao.github.io/) · [Browse writing](https://unraveltao.github.io/posts/) · [Explore projects](https://unraveltao.github.io/projects/)

</div>

## About Me

I’m an independent developer interested in software engineering, open source, and AI agents. I build projects to understand how things work and share technical notes and reflections along the way.

This repository contains the source for my personal website: a portfolio of selected projects and a collection of technical writing. I use it to explain what I build, what I learn from those projects, and the reasoning behind important technical decisions.

## Explore the site

- **Writing:** browse published articles, methods, and project notes.
- **Personal OS:** read the evolving practices I use to connect long-term goals with daily work.
- **Projects:** see selected software projects and their available source or documentation links.
- **RSS:** subscribe to new posts at [`/rss.xml`](https://unraveltao.github.io/rss.xml).

This is a personal website and does not accept code contributions. The repository is public for transparency and reference; it is not a supported starter template. For the intended reading experience, visit the live site.

## Contributors

This site is maintained by [Iron Tom](https://github.com/unraveltao). Codex helps with selected engineering tasks; changes are reviewed before publication.

| Maintainer | AI collaborator |
| --- | --- |
| [Iron Tom](https://github.com/unraveltao) | [<img src="https://avatars.githubusercontent.com/u/267193182?s=80&v=4" alt="Codex GitHub avatar" width="48" height="48"> Codex](https://github.com/codex) |

## Technology

The site is built with Vite, React Router, and Velite. Content lives in the repository and is validated during the build. When `main` is updated, GitHub Actions runs checks, builds the site, and deploys it to GitHub Pages. Vercel creates preview deployments for changes so they can be reviewed before merging.

## Run locally

Requirements: Node.js 22 and pnpm 9.

```bash
pnpm install
pnpm dev
```

The development server runs at <http://localhost:5173>.

```bash
pnpm test
pnpm build
pnpm preview
```

These commands validate content and run tests, build the static site, and preview the output with GitHub Pages-style trailing-slash and 404 behavior.

## Content and maintenance

Posts are stored in `content/posts/<slug>/index.mdx`; projects are stored in `content/projects/<slug>/index.mdx`. The content schema in `velite.config.ts` is the source of truth for frontmatter fields. Published post slugs and dates are stable.

See [AGENTS.md](AGENTS.md) for repository boundaries and safe change rules. The [project documentation index](docs/00-Project-Overview.md) links to product requirements, design notes, architecture, and decisions. The [development roadmap](docs/05-Development-Roadmap.md) records only current and conditional follow-up work.

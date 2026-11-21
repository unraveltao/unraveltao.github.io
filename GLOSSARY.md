# Project Glossary

This site is a personally maintained portfolio and selected-writing site. See [ADR-0012](docs/adr/0012-portfolio-and-selected-writing.md) for its current positioning.

## Content terms

**Post** — One of the site's two content entities. Posts contain methods, technical decisions, and practice-based writing with a clear conclusion. A Post is separate from a Project.

**Series** — An ordered group of Posts, represented by the `series` and `order` fields. It is metadata, not a third content entity.

**Category** — One author-selected editorial type for a Post: Thinking, Review, Skill, or Log. Categories organize the Personal OS pages; tags describe topics.

**Tag** — A flat, uncolored string used to filter Posts. Tags do not have descriptions, icons, or a hierarchy.

**Featured** — A published Post selected for the homepage. At most one Post may be featured; when none is selected, the section is hidden.

**Draft** — A Post excluded from production pages, RSS, and sitemap. Drafts may be visible during local development.

**Published** — A non-draft Post whose publication date has arrived in the Asia/Shanghai timezone. Only published content is exposed on production pages and feeds.

**Project** — The site's second content entity, describing a project with a name and optional verified summary, status, stack, repository, documentation, or demo links. A Project is neither a Post category nor part of a Series.

**Markdown Post** — A Post authored at `content/posts/<slug>/index.md` with YAML frontmatter. The content pipeline also accepts legacy `index.mdx` files during migration; Projects remain `.mdx`.

## Interface terms

**Theme** — A selectable appearance applied through `data-theme` on `<html>`. The six implemented themes are `spring`, `summer`, `autumn`, `winter`, `geeker`, and `hacker`. The theme list is defined in `app/lib/theme.ts`; styles are in the existing theme CSS files and selections are stored in `localStorage` when available.

**Preset** — A proposed layout-level visual mode such as `minimal`, `developer`, `editorial`, or `dashboard`. Presets are not implemented. They would be distinct from the six current themes and require a separate decision.

## Publishing terms

**Site publishing** — Pushing changes to `main`, which triggers GitHub Actions to build and deploy the website.

**External publishing pipeline** — A workflow that posts articles to external platforms such as WeChat Official Accounts or Zhihu. It is a separate project and is not part of this repository; only article text might be shared.

## Language policy

Article prose uses the author's chosen language and remains primarily Chinese. Technical documentation and `AGENTS.md` are in English; the README is bilingual. The site has a single content locale, `zh-CN`, and no parallel English title or summary fields.


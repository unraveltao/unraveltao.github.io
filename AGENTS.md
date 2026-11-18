# Repository Instructions

## Project boundaries

- This repository is a static personal website built with Vite 7, React Router 7, and Velite. Content and page code are separate.
- The only content entities are Post and Project. Posts live in `content/posts/<slug>/index.mdx`; projects live in `content/projects/<slug>/index.mdx`. Methods and related writing use Post plus Series; do not add another content collection.
- `app/` contains routes, components, shared logic, and styles. `public/` contains site-wide assets. `scripts/` and `tests/` contain build and content validation code.
- `.velite/`, `.react-router/`, and `build/` are generated directories. Do not edit them by hand.

## Content rules

- `velite.config.ts` is the single source of truth for frontmatter fields and validation. A Post requires a title, a 20–160 character summary, a date, and 1–3 kebab-case tags.
- Personal OS posts use `series: personal-os` and a positive integer `order`. Its navigation is generated from published posts; adding a module must not require page or route changes.
- Do not use an `h1` in post bodies. Begin at `h2` and do not skip heading levels. Add a language to code fences. Images must use a relative path to the same post directory and include descriptive alt text. Internal links must use trailing slashes.
- Published slugs and dates are stable. Do not delete, overwrite, or rewrite existing posts or images unless the task explicitly identifies the content to change.
- Do not invent personal experiences, project facts, or outcomes. Clearly label unverified methods and results as unverified.

## Implementation boundaries

- Read content through `app/lib/content.ts`; use only `app/lib/publish.ts` for publication decisions.
- Reuse the existing six-theme system. Define color values only in the existing theme token styles. Follow existing component style conventions and preserve visible focus indicators.
- Do not add dependencies, a third content entity, a database, or a CMS. Avoid unrelated refactoring, bulk renaming, and formatting.
- Update `docs/02-Product-Requirements.md` when page behavior changes. Update `docs/04-Technical-Architecture.md` when maintenance entry points, build behavior, or prerendering changes. Update `docs/03-Design-System.md` when visual specifications change.
- Register static pages in both `app/routes.ts` and the prerender list in `react-router.config.ts`. Dynamic post routes are generated from content. All public URLs use trailing slashes.
- Preserve `routeDiscovery: { mode: 'initial' }`, CSS assets after CSS inlining, synchronous theme initialization, and hydration-time theme restoration.

## Verification and publishing

```bash
pnpm test
pnpm build
pnpm preview
```

`pnpm build` includes content validation and TypeScript checks. For page changes, also inspect narrow layouts, keyboard operation, theme display, and trailing-slash URLs. Do not claim checks that were not run.

The release branch is `main`; `.github/workflows/deploy.yml` deploys the site. Review and stage only files for the current task. Never force-push, use `--no-verify`, or overwrite another person's work. If GitHub HTTPS connectivity fails, use the established SSH remote:

```bash
git push git@github.com:unraveltao/unraveltao.github.io.git main
```

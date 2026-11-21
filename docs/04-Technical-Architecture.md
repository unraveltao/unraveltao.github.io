# Technical Architecture and Maintenance

> Updated on 2026-11-19. Daily commands are in the [README](../README.md); product behavior is in [Product Requirements](02-Product-Requirements.md); historical decisions are indexed in [Decision Log](06-Decision-Log.md).

## 1. Architecture map

| Path | Responsibility |
|---|---|
| `app/routes.ts` | Explicit route table |
| `app/routes/` | Route loaders, page rendering, metadata, and page-level interactions |
| `app/components/` | Shared interface components |
| `app/lib/content.ts` | Typed content access and published-content filtering |
| `app/lib/publish.ts` | The single publication predicate |
| `app/lib/site.json` | Site identity, URL, description, and repository link |
| `app/lib/seo.ts` | Titles, canonical URLs, Open Graph, and structured data |
| `app/lib/theme.ts` | Theme list, persistence, and initialization behavior |
| `app/lib/reading-preferences.ts` | Reading typography options, persistence, and synchronous initialization |
| `app/lib/contact-links.ts` | Author-approved contact methods and external account URLs |
| `app/lib/post-categories.ts` | Ordered category names and labels derived from `content/post-categories.json` |
| `app/styles/` | Existing global and theme styles |
| `content/` | Post, Project, Series, and registered Post category data |
| `velite.config.ts` | Post and Project schemas and Markdown processing |
| `react-router.config.ts` | Static prerender route list |
| `vite.config.ts` | Development content rebuilds and path aliases |
| `scripts/lib/content-rules.mjs` | Pure cross-file validation rules |
| `scripts/validate-content.mjs` | Content validation CLI, including body checks |
| `scripts/postbuild.mjs` | CSS inlining, 404 output, RSS, and sitemap generation |
| `scripts/serve.mjs` | Local preview with GitHub Pages-style redirects and 404 handling |

Keep the directory structure shallow. Keep page-private logic with its page until it is reused or has an independent rule. Do not hand-edit `build/`, `.velite/`, or `.react-router/`.

## 2. Content and rendering

The content model has two entities: Post and Project. A Post's required category is registered in `content/post-categories.json`; the Personal OS category pages use it to group writing. Series are derived from separate Post metadata. Velite validates and emits build-time JSON and rendered HTML. Pages read content only through `app/lib/content.ts`; do not duplicate publication filtering in routes or components.

`pnpm build` runs Velite, cross-file validation, React Router type generation, TypeScript, prerendering, and postbuild processing. Any failure stops the build. `pnpm test` runs the Node built-in test suite for pure validation rules. The deployment workflow runs on pushes to `main` and can also be triggered manually.

Published Posts are selected by `app/lib/publish.ts`: not drafts, with a date no later than the current date in Asia/Shanghai. Development mode may show drafts and future-dated Posts. Production builds exclude draft Projects. The Post, Project, and Series detail routes are derived from published content; static routes are listed in `react-router.config.ts`.

## 3. Deployment and URL behavior

GitHub Actions uses Node.js 22 and pnpm 9 to build and deploy `build/client/` to GitHub Pages. No separate deployment service is required.

All public URLs use trailing slashes. `app/lib/seo.ts` normalizes canonical URLs; article structured data follows the same convention. The site URL comes from `app/lib/site.json`; RSS and sitemap generation use that configuration. When adding a static route, register it in both `app/routes.ts` and the prerender list in `react-router.config.ts`. Posts, Projects, and Series pages are generated from content. `/personal-os/` and one `/personal-os/:category/` page per entry in `content/post-categories.json` are prerendered; each detail page filters published Posts through their required category metadata. `/contact/` is a static page backed by `app/lib/contact-links.ts`; it does not add a content entity. Legacy Workshop and Workflow routes remain available.

The local preview command is `pnpm preview`, backed by `scripts/serve.mjs`. It models missing-slash redirects and not-found behavior; do not substitute `vite preview` when checking those hosting behaviors.

## 4. Invariants to preserve

- Keep `routeDiscovery: { mode: 'initial' }`. GitHub Pages does not provide the `/__manifest` endpoint required by lazy route discovery.
- Keep generated CSS assets after inlining CSS into prerendered HTML; client-side navigation still references those assets.
- Keep Velite output from being cleaned before React Router reads the generated JSON.
- Initialize the theme synchronously in the document head to avoid a flash, and preserve theme restoration after hydration.
- Do not use `text-rendering: optimizeLegibility`; the reason is recorded in the decision history.
- Keep public URLs and canonical values slash-terminated.

## 5. Content maintenance

Posts and Projects are authored in the repository. `velite.config.ts` owns their schema. Post images normally live beside their post and require alt text. Do not change a published Post's slug or date. Set `updated` only for substantive revisions. Projects have no date and do not appear in RSS. RSS contains the full text of up to 20 published Posts.

The homepage uses Project ordering and the `featured` Post flag rather than maintaining a second curation list. Ordinary Posts do not need to be featured. Project details associate writing through `Post.project`; repository, documentation, and demo links render independently when present.

## 6. Visual themes and performance

The implemented theme list is defined in `app/lib/theme.ts`: `spring`, `summer`, `autumn`, `winter`, `geeker`, and `hacker`. Theme styles are currently spread across `app/styles/garden.css`, `app/styles/garden-themes.css`, and `app/styles/global.css`. The design document still contains historical and aspirational specifications that do not fully match the implementation; treat it as guidance, not proof of current styling. Reconcile it against the rendered site during the planned UI cleanup.

Reading typography remains separate from the six color themes. `app/lib/reading-preferences.ts` validates the local-storage value and supplies defaults to the synchronous head initializer and React provider; the provider restores the HTML data attributes after hydration and applies user changes immediately. CSS scopes these attributes to long-form `.article-body` content. Keep the existing synchronous theme initialization and hydration-time restoration intact.

The historical first-screen JavaScript budget is 130KB gzip. Measurements recorded on 2026-11-02 ranged from about 119KB to 130KB depending on page and build. Those figures are not a current performance baseline. Re-measure after a meaningful UI or dependency change. There is no automated budget gate today.

Do not add a dependency without checking whether the platform or build step can do the job and whether the runtime cost fits the static site. The site currently has no third-party UI, theme, state, animation, icon, or date library.

## 7. Known limitations

- Human review is still needed for factual accuracy, typos, image meaning versus alt text, and complex MDX.
- Workshop's export fields and heading conventions are not a direct match for the Post schema; do not treat its output as a publish-ready Post without conversion.
- All posts share `public/og.png`; there is no post scaffold, formatter, or lint command.
- The 130KB gzip budget is documented but not enforced automatically.
- Real project screenshots, demos, contributions, and outcomes must come from the author; do not invent them.

## 8. Verification

Run `pnpm test`, `pnpm build`, and `pnpm preview` as appropriate to the change. A successful build verifies content, types, and generated routes, but does not replace browser checks. For UI work, inspect narrow layouts, keyboard flows, all themes, and URL behavior. Report only checks actually performed.

## 9. Historical verification notes

The figures below describe specific past revisions. They are retained as history, not as current build counts or a current performance baseline.

- **2026-11-02 — project and maintenance documentation:** At that revision, `pnpm validate`, the 27-test suite, `pnpm check`, and `pnpm build` passed. The build emitted 8 pages, one RSS item, and 7 sitemap entries. Local preview checks confirmed a 200 response for `/projects/lattice/`, a 301 redirect for the missing trailing slash, a 404 for unknown paths, and successful RSS and sitemap responses. Browser checks for narrow layout, keyboard navigation, and all themes remained incomplete.
- **2026-11-02 — Lattice source verification:** Project positioning and repository links were based on the author-provided Lattice repository and its README and architecture document. No unverified contribution claims or quantified outcomes were added.
- **2026-11-02 — removal of inaccurate Lattice posts:** The author confirmed that two earlier Lattice posts contained invented experience and figures. Those posts and their now-empty series were removed. Their claims and old verification notes are not evidence about the project.
- **2026-11-09 — Personal OS entry:** The `/personal-os/` directory and first method post passed content validation and a production build. The generated entry, post, RSS, sitemap, and trailing-slash canonicals were inspected. Mobile/desktop browser appearance, keyboard behavior, and all-theme visual checks were not completed in that environment.
- **2026-11-18 — software-learning series:** Six posts and the `restarting-software` Series were added as content. The current `main` revision includes their publication; this note records the content change, not a new architecture decision.
- **2026-11-22 — Reading preferences and contact page:** Added a static `/contact/` route with account data maintained outside content collections, plus persisted reading typography settings independent of the six color themes.

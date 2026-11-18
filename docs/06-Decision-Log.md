# Decision Log

> Append new decisions; do not rewrite their rationale after the fact. If a decision changes, add a new ADR that supersedes the old one. Full records live in [`adr/`](./adr/); this file is the index and a concise summary.
>
> Last updated: 2026-11-19.

## 1. Why keep a decision log

Many implementation choices look interchangeable when viewed without their original constraints. Recording the reason and the trade-off helps prevent a future “cleanup” from restoring an option that was deliberately rejected. For example, CSS is inlined into the static output even though this increases HTML size and prevents cross-page CSS caching; the earlier measurement showed that the stylesheet request delayed first rendering. Preserve the decision until new evidence justifies revisiting it.

## 2. Decision index

| ADR | Decision | Current status |
|---|---|---|
| [0001](./adr/0001-blog-positioning.md) | Engineering narratives as the original editorial focus | Partially superseded by 0012 |
| [0002](./adr/0002-mdx-in-repo.md) | Store MDX in the repository and publish through Git | Active |
| [0003](./adr/0003-visual-identity.md) | Continue the visual language of the original Profile README | Active as historical direction; current UI needs reconciliation |
| [0004](./adr/0004-astro-static.md) | Astro static output instead of Next.js | Superseded by 0011 |
| [0005](./adr/0005-post-only-content-model.md) | Begin with Posts as the only content entity | Partially superseded by 0007 |
| [0006](./adr/0006-github-pages.md) | Deploy the user site to GitHub Pages | Active |
| [0007](./adr/0007-project-as-second-entity.md) | Add Project as a second content entity | Active |
| [0008](./adr/0008-chinese-primary-english-metadata.md) | Keep the site Chinese-first and avoid translated route trees | Partially superseded by 0009; still active for site content |
| [0009](./adr/0009-drop-unused-metadata-fields.md) | Remove unused English metadata and cover fields | Active |
| [0010](./adr/0010-series-nav-as-left-rail.md) | Place series navigation in the left rail on wide screens | Active; verify during UI review |
| [0011](./adr/0011-vite-react-router.md) | Use Vite, React Router 7, and Velite | Active |
| [0012](./adr/0012-portfolio-and-selected-writing.md) | Focus the site on the portfolio and selected writing | Active |

## 3. Core trade-offs

| ADR | Chosen priority | Accepted cost |
|---|---|---|
| 0001 | Demonstrate judgment rather than maximize traffic | The editorial line is narrower than a tutorial library |
| 0002 | Keep content reviewable in Git | Writing from a phone is less convenient; images increase repository size |
| 0003 | Preserve a recognizable visual identity | Theme-specific colors and current implementation must be reconciled |
| 0004 | Prefer zero JavaScript by default (historical choice) | Superseded when the stack changed; retained as context |
| 0005 | Avoid multiplying content-specific routes and feeds | Short ideas either become Posts or remain unpublished |
| 0006 | Keep hosting and root-relative URLs simple | The repository name is tied to the public URL; GitHub Pages redirects to trailing-slash paths |
| 0007 | Let visitors see real projects | A small portfolio may have only a few entries |
| 0008 | Prioritize the primary Chinese-reading audience | There are no translated English routes or parallel article bodies |
| 0009 | Keep schema fields tied to implemented behavior | Per-post social images would need a new title source if introduced |
| 0010 | Keep a series visible while reading it | Wide-screen and keyboard navigation have a deliberate layout trade-off |
| 0011 | Reduce maintenance cost by using the maintainer's familiar React stack | First-screen JavaScript increased to about 122KB gzip in the migration baseline; article bodies are rendered HTML, not hydrated React components |
| 0012 | Present credible projects and selected judgment | Homepage curation is manual; less prominent tools are harder to discover |

## 4. Rejected or deferred proposals

| Proposal | Reason |
|---|---|
| Add an external publishing pipeline to this repository | Browser sessions, scheduling, retries, and a resident process would add a backend-like operational surface to a static site. Treat it as a separate project; content text may be shared. |
| Add four visual presets (`minimal`, `developer`, `editorial`, `dashboard`) | They multiply visual verification work and may conflict with the existing design direction. The implemented six themes are not the same feature as presets. |
| Create a full `/en` mirror | Every post would need a second maintained body, routes, language controls, and feed behavior. There is no current translated-content requirement. |
| Return to Astro or switch to an SPA-only React app | ADR-0011 records the maintenance and static-rendering trade-offs behind the current framework choice. |
| Add analytics, search indexing, or comments without a reader need | Each adds external requests, scripts, an iframe, or ongoing maintenance. See the conditional triggers in the [Maintenance Plan](05-Development-Roadmap.md). |

## 5. Open questions

| Question | Current position | Revisit when |
|---|---|---|
| Per-post Open Graph images | The site shares `public/og.png`; no per-post generator exists. | Distinct previews have demonstrated value and the added build or asset maintenance is acceptable. |
| Markdown in place of MDX | Posts currently use `.mdx` paths and the content pipeline is configured for them. | A source audit shows MDX-only syntax is unused and Markdown would materially simplify authoring. |
| Search or comments | Not planned. | Readers show a concrete need. |

## 6. Recording a new decision

1. Confirm that the choice has a meaningful trade-off; routine implementation details do not need an ADR.
2. Add `docs/adr/<next-four-digit-number>-<kebab-case-title>.md`, following the existing format.
3. Add one row to the index above.
4. If the new decision supersedes an old one, update only the old entry's status; preserve its original rationale.
5. Update affected requirements, design, and architecture documents, and reference the ADR where useful.

Use this short format:

```markdown
# Decision title in one declarative sentence

Explain the decision and why it fits the constraints.

**Considered Options**: List the alternatives and the reason each was rejected.

**Consequences**: Record costs, limitations, and future work created by the decision.
```

If the consequences cannot be stated, the decision may not be ready to record.

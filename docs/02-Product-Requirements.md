# Product Requirements

> Updated on 2026-11-19. `velite.config.ts` is the source of truth for field types and validation; this document describes product intent.

## 1. Scope

The site is a personal homepage, project portfolio, and selected technical writing. It has two content entities: Post and Project. Series is metadata on Posts, not a separate entity. Site content remains primarily Chinese; repository and technical documentation are maintained in English. The site does not accept code contributions.

## 2. Pages and URLs

| URL | Purpose |
|---|---|
| `/` | Introduction, representative project, selected writing, and GitHub contact link |
| `/projects/` | Projects, sorted by `order` and then name |
| `/projects/:slug/` | Project details |
| `/posts/` | Published posts in reverse chronological order, filterable by tags and keywords |
| `/posts/:slug/` | Post body, table of contents, series navigation, and adjacent posts |
| `/personal-os/` | Ordered directory of published Posts in the `personal-os` series |
| `/contact/` | Public contact methods and links to the author's other platforms |
| `/series/:series/` | Published posts in a series |
| `/workshop/`, `/workflow/` | Legacy routes retained for existing links, outside the primary navigation |
| `/404/` | Not-found page; static hosting also receives a root `404.html` |

The build also generates RSS and a sitemap. There is no separate tag index or About page. Public links and canonical URLs use trailing slashes. Published slugs remain stable; URLs do not contain dates.

## 3. Navigation

The primary navigation contains Home, Writing, Personal OS, and Projects. Search, appearance controls, and GitHub remain in the utility area. Workshop is not in the primary navigation. The footer links to Contact, GitHub, and RSS.

## 4. Page behavior

### Homepage

Show the personal introduction, the first project by configured order, and manually selected published writing, in that order. Do not add a separate project-featured field. At most one Post may be featured; hide the writing section when none is selected. GitHub is the current contact route. Do not show the example email address. There is no content-count or posting-frequency requirement.

### Projects

Every Project has a name. Add summaries, status, stack, and links only when verified information is available; omit unknown optional values. Project status may be Idea, Active, Done, or Archived. Details may explain the problem, implementation, and trade-offs when source material supports them.

Render repository, documentation, and demo links independently from `repo`, `docs`, and `demo`. Omit missing links without placeholders; never use the site's Workshop as a substitute demo. Do not use decorative product-window imagery on project details. Real screenshots may be added to project content when supplied by the author. The project list may use decorative illustrations.

Below project details, show published Posts whose `project` matches the project slug, in the same date order as the writing list. Hide the section when there are no matches. Projects have no publication date and do not appear in RSS, tag filters, or series.

### Writing

Posts may contain methods, technical decisions, and practice-based retrospectives. Preserve existing URLs. A newly published Post does not become a homepage feature automatically. The writing list remains available regardless of homepage selection and orders posts newest first on a vertical timeline. Each row connects its date and a small sequence number to the title, summary, and reading time with a fine left rail and node. Keep a little space between the number and node. Use an underline below article content that is long enough to cover the longest title, while remaining inside the article column. Show at most 20 Posts per page; when there are more results, provide previous/next arrows and a compact current/total page indicator, and number rows 01–20 on each page. Do not add year groups, category filters, or tag chips. Post bodies begin at `h2` and do not skip heading levels. Article pages show summary, date, and reading time; tag metadata remains in frontmatter but is not shown in the interface for now. Set `updated` only after a substantive revision.

### Personal OS

`/personal-os/` presents four editorial columns as a responsive card grid: Think, Review, Skill, and Log. The cards explain each column's purpose; they do not assign or list Posts yet. Article placement is an editorial decision and will be organized later, with tags describing each Post's specific topics. Existing Post and Series metadata and all article URLs remain unchanged.

### Appearance and reading typography

The header gear opens one panel with two separate groups: the six existing color themes and reading typography preferences. Reading preferences are font family (site default, sans, serif), text size, line spacing, and reading width. They apply to long-form Post and Project bodies; navigation, theme colors, the article heading hierarchy, and code typography remain stable. Changes apply immediately and persist on the current device. The panel offers a restore-defaults action. Defaults preserve each theme's current body typography.

### Contact and other platforms

`/contact/` groups approved public contact methods separately from content-platform accounts. Link data is maintained in `app/lib/contact-links.ts`; do not publish example values or infer personal details from account metadata. Until approved values are added, show a short pending message in each group. Email links open a message composer; visitors attach files themselves. The footer links to this page. Do not add a new content collection for these static links.

## 5. Content model and authoring

### 5.1 Files

- Posts: `content/posts/<slug>/index.mdx`
- Projects: `content/projects/<slug>/index.mdx`
- Series metadata: `content/series.json`
- Post images: normally beside the post and referenced with a relative path. Reusable method illustrations may live in `public/assets/`.

There is no Page collection or `content/pages/` directory.

### 5.2 Post fields

A Post requires a title, a conclusion-oriented summary, a date, and 1–3 kebab-case tags. The title is at most 40 characters and the summary is 20–160 characters. Slugs and tags use lowercase letters, digits, and hyphens. Optional fields include project, series, order, draft, featured, and updated. A Post in a series requires a positive integer `order`. Personal OS modules use `series: personal-os`. `updated` records a substantive change, not every edit.

### 5.3 Project fields and publishing

The Project name is required. Summary, stack, status, repository, documentation, demo, order, and draft are optional; when supplied, summary is 20–80 characters, stack contains 1–5 kebab-case values, and status is `idea`, `active`, `done`, or `archived`. Projects have no date.

Field types, defaults, and validation are defined in `velite.config.ts`. Post publication uses only `app/lib/publish.ts`: a Post is published when it is not a draft and its date is no later than the current date in Asia/Shanghai. Development mode exposes drafts and future-dated Posts for preview. Production builds exclude draft Projects.

### 5.4 Writing conventions

Label code fences with their language. Give images descriptive alt text. Use complete HTTPS URLs for external links and root-relative, trailing-slash URLs for internal links. Avoid italic emphasis in Chinese prose. Put the main conclusion in the summary. Base project claims on verified source material.

### 5.5 Validation

Velite schema failures stop the build. Cross-file checks cover duplicate series order, unknown series, more than one published featured Post, and `updated` earlier than `date`; they are maintained in `scripts/lib/content-rules.mjs` with regression tests. Custom slug collisions, body heading hierarchy, internal-link trailing slashes, and image references are not all checked automatically in the current baseline. Complex MDX syntax, whether an image matches its alt text, factual accuracy, and typos require human review.

## 6. Quality criteria

`pnpm test` and `pnpm build` must pass. At 375px, pages must not scroll horizontally; keyboard users must be able to operate navigation and primary interactions. First-screen JavaScript must remain below 130KB gzip; measurement history is in [Technical Architecture](04-Technical-Architecture.md), and Lighthouse scores need a fresh measurement. Verify readable content, correct links and canonicals, RSS exclusion of Projects and unpublished content, a 301 for missing trailing slashes, and a 404 for unknown paths in the static preview.

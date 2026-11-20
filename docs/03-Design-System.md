# Design System

> **Status:** This document preserves the visual specification recorded on 2026-10-31. It is an historical design target, not a verified description of the current UI. The implementation uses six themes and styles spread across `app/styles/garden.css`, `app/styles/garden-themes.css`, and `app/styles/global.css`; those files do not match every token and component rule below. Reconcile the specification with the site during the planned UI review before treating any value here as current.
>
> The original visual identity decision is [ADR-0003](./adr/0003-visual-identity.md). Updates recorded on 2026-11-02 and 2026-11-09 are retained in the relevant sections below.

## 1. Design principles

1. **Use typography for hierarchy:** distinguish content with type size, weight, contrast, and whitespace rather than cards, filled blocks, or shadows.
2. **Use one accent color** for interactive elements and key conclusions; avoid decorative color.
3. **Prefer square corners.** Rounded corners are limited to inline code and images (2px); other surfaces use no radius.
4. **Prioritize Chinese reading rhythm** when choosing line height, line length, and punctuation; Latin text should remain comfortable as well.

## 2. Historical color tokens

These values belong to the 2026-10-31 specification and do not describe all six current themes.

### Light

| Token | Value | Use | Contrast |
|---|---|---|---|
| `--bg` | `#FFFFFF` | Page background | — |
| `--surface` | `#F7F7F2` | Inline code, code blocks, quotes | — |
| `--ink-900` | `#1A1A17` | Body and headings | 17.4:1 on `--bg` |
| `--ink-600` | `#57574F` | Secondary text, leads, summaries | 7.0:1 |
| `--ink-400` | `#6E6E66` | Dates, tags, footer metadata | 5.1:1 |
| `--line` | `#E6E6DF` | Dividers and table rules | — |
| `--accent` | `#0F6E56` | Links, current items, conclusions | 6.2:1 |
| `--accent-strong` | `#0A5340` | Link hover and active states | 8.4:1 |
| `--accent-wash` | `#EAF3F0` | Text selection and active TOC item | — |

### Dark

| Token | Value | Use | Contrast |
|---|---|---|---|
| `--bg` | `#121211` | Page background | — |
| `--surface` | `#1B1B19` | Code blocks and quotes | — |
| `--ink-900` | `#EDEDE7` | Body and headings | 14.8:1 |
| `--ink-600` | `#A6A69C` | Secondary text | 7.2:1 |
| `--ink-400` | `#8C8C82` | Metadata | 5.6:1 |
| `--line` | `#2A2A26` | Dividers | — |
| `--accent` | `#4EC3A3` | Links and current items | 8.7:1 |
| `--accent-strong` | `#6FD8BB` | Hover and active states | 10.9:1 |
| `--accent-wash` | `#17322A` | Selection and active TOC item | — |

The original specification prohibited `#0F6E56` in the dark theme because its contrast on `#121211` was 3.05:1. Dark themes should use a sufficiently bright accent.

## 3. Original theme behavior

The 2026-10-31 specification described a light/dark switch: follow `prefers-color-scheme` by default, store a manual choice as `localStorage['theme'] = 'light' | 'dark'`, and apply it with `data-theme` on `<html>`. A synchronous script in `<head>` was intended to prevent a flash of the wrong theme. The switch was specified as a text button labeled `light` or `dark`, with an accessible name containing the visible word to satisfy WCAG 2.5.3 (Label in Name).

**Current implementation differs:** the theme identifiers are `spring`, `summer`, `autumn`, `winter`, `geeker`, and `hacker`, defined in `app/lib/theme.ts`. Keep this six-theme behavior when making routine UI changes unless a new direction is explicitly agreed.

## 4. Typography (historical specification)

```css
--font-sans: "Inter var", -apple-system, "Segoe UI", "PingFang SC",
             "Noto Sans SC", "Microsoft YaHei", sans-serif;
--font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo,
             Consolas, "Noto Sans Mono CJK SC", monospace;
```

- Self-host Inter and JetBrains Mono as WOFF2 files using only the Latin subsets (about 30KB each); use system fonts for CJK rather than downloading multi-megabyte Chinese font files.
- Use `font-display: swap`; use `font-feature-settings: "tnum"` for dates and numeric columns.
- Avoid italic emphasis in Chinese prose. Use the accent color or weight 600; the original specification styled `<em>` in Chinese paragraphs with the accent color.

## 5. Type scale and reading measure

The historical scale used a 1.25 modular ratio and a 17px body baseline.

| Token | Desktop | Mobile | Line height | Weight | Intended use |
|---|---:|---:|---:|---:|---|
| `--text-display` | 42px | 32px | 1.15 / 1.2 | 600 | Post title and site name |
| `--text-h2` | 33px | 27px | 1.3 | 600 | Post `h2` |
| `--text-h3` | 27px | 22px | 1.4 | 600 | Post `h3` |
| `--text-h4` | 21px | 19px | 1.5 | 600 | Post `h4` and list title |
| `--text-lead` | 19px | 18px | 1.7 | 400 | Lead and homepage introduction |
| `--text-body` | 17px | 17px | 1.75 | 400 | Body |
| `--text-small` | 15px | 15px | 1.6 | 400 | Captions and footnotes |
| `--text-meta` | 13px | 13px | 1.5 | 500 | Dates, tags, navigation |

The original spec used `letter-spacing: -0.01em` for headings and uppercase Latin metadata with `letter-spacing: .06em`.

- Reading measure: `--measure: 680px`, estimated at about 40 Chinese characters per line at 17px.
- Left-align body text; do not justify Chinese paragraphs.
- Paragraph spacing: `1.25em`; do not indent the first line.
- Headings have more space above than below (`margin-top: 2.5em; margin-bottom: .8em`).
- Use `text-wrap: pretty` for headings and leads; reserve `balance` for display headings.
- Use full-width Chinese punctuation. Add thin spacing around code and numbers where needed if `text-spacing` is unavailable.

## 6. Spacing, borders, and motion

- Spacing scale: `4 8 12 16 24 32 48 64 96 128` (4px base).
- Vertical rhythm: 64px between small sections and 96px between major sections; halve these values on mobile.
- Historical radii: `--radius: 0`, `--radius-sm: 2px` for inline code and images, `--radius-window: 6px` for code windows.
- Use `1px solid var(--line)` for borders. The specification rejected shadows, glass effects, and gradients.
- Images use `max-width: 100%`, square or 2px corners, optional `--line` border, and required alt text.
- Motion duration: 160ms with `cubic-bezier(.2, 0, 0, 1)`. Animate only `opacity`, `transform`, `color`, and `border-color`; avoid animating `height` and `filter`.
- Do not animate page navigation. Respect `prefers-reduced-motion: reduce` by removing motion.

## 7. Historical component specifications

The following component measurements were proposals, not a verified audit of the current site.

### Navigation

- 64px tall with a 1px bottom rule that appears only after scrolling.
- Site name on the left; 3–4 metadata-sized links on the right with 24px spacing.
- Use the accent for the current link and secondary text color for other links. No underline animation.

### Post and Project list rows

- Post row: date, title, and a one-sentence summary (maximum two lines).
- Project row: status and stack, project name, and a one-sentence summary. Show no more than three stack labels, separated by `·`.
- Use 40px between rows and whitespace instead of dividers. A small portfolio should not add empty slots or a “more” placeholder.
- Hover changes the title to the accent color over 160ms. The entire row is clickable without a filled background.
- A historical archive design proposed year dividers; the current product requirements specify a flat, reverse-chronological list.

### Post header and body

- Post title uses the display style; date, reading time, and tags share one metadata line separated by `·`.
- Lead text uses the lead size and secondary text color, 16px below the title. Leave 48px before the body; an optional divider may appear there.
- Links use the accent, a 1px underline, and 3px offset. Hover thickens the underline to 2px without changing its color.
- Unordered lists use an en dash marker; ordered lists use monospaced numbers.
- Quotes use a 2px left rule, 16px inset, secondary text color, and no italic style.
- Inline code uses the surface color, 2px radius, 0.9em monospace, and 4px horizontal padding without a border.
- Code blocks use a macOS-style title bar with three 10px dots (`#FF5F57`, `#FEBC2E`, `#28C840`) and an uppercase language label. The code area scrolls horizontally without wrapping. The original spec allowed these three dot colors as a deliberate exception to its limited-palette rule. Syntax highlighting uses low-saturation `min-light` and `min-dark` themes.
- Tables use horizontal rules only: a stronger rule under the header and `--line` between rows. Images may have a caption below them, aligned with the image.

### Table of contents and series navigation

- TOC: show at widths of at least 1200px in a sticky 200px right rail, 48px from the body and 96px from the top. Show `h2` and `h3`; indent `h3` by 12px. The active item uses the accent and a 2px left rule.
- Series rail: show only for a Post in a Series containing more than one Post. At widths of at least 1280px, use a sticky 200px left rail, 48px from the 680px body and 96px from the top. Below 1280px, place it after the body and before adjacent-post links, with a top rule.
- The rail heading identifies the current position and Series name. Number entries; use no card background or border. Chinese titles may wrap over several lines in the 200px rail.
- The accepted layout and its keyboard-order trade-off are recorded in [ADR-0010](./adr/0010-series-nav-as-left-rail.md).

### Tags, adjacent links, and footer

- Tags are plain text with a monospaced `#` prefix; hover uses the accent. Do not use pill backgrounds.
- Adjacent-post navigation uses “← Previous / Next →” text links, with whitespace or `·` between them; no page-number control.
- The historical footer proposal placed copyright, RSS, repository, and email links on one metadata line, 96px below the content with a top rule. The current README and product requirements identify GitHub and RSS as public footer links.

### Focus states

Use a visible `:focus-visible` outline, historically specified as `2px solid var(--accent)` with a 2px offset. Do not remove outlines without an equivalent visible replacement.

## 8. Accessibility baseline

- Text contrast should be at least 4.5:1, including 13px metadata; target at least 7:1 for body text.
- Keep mobile body text at 17px or larger. Interactive targets should be at least 44×44px; full-row links satisfy this when implemented as specified.
- Complete all interactions by keyboard. Keep Tab order consistent with reading order, except for the series rail trade-off documented in ADR-0010.
- Use one page-level `h1`, do not skip heading levels, and provide `nav`, `main`, `article`, and `footer` landmarks where appropriate.
- Meaningful images need descriptive alt text; decorative images use empty alt text.

## 9. Information-architecture decisions recorded with this specification

These decisions are reflected in current product documentation; the paths below identify the implementation at the time of the 2026-11-02 review.

| Topic | Decision recorded | Historical implementation reference |
|---|---|---|
| Homepage featured writing | Place after the representative project; hide the section when no Post is featured | `app/routes/home.tsx` |
| Writing list grouping | Do not group by year; use a flat list filtered by tag and keyword, sorted by date | `app/routes/posts.tsx` |
| Search | Open a native `<dialog>` with Ctrl/⌘+K; filter published Posts and Projects | `app/components/SearchDialog.tsx` |
| Visual presets | Do not implement `minimal`, `developer`, `editorial`, or `dashboard` presets. If reconsidered, presets must be separate from the six themes and may change tokens, not layout, unless a new decision says otherwise. | [ADR-0003](./adr/0003-visual-identity.md), [Decision Log](./06-Decision-Log.md) |

## 10. UI-change workflow

For the upcoming UI review, first record the specific user-facing problem and the intended outcome. Update this document only for lasting visual rules or specifications; small local adjustments do not need an ADR. Discuss changes to the theme model, a UI framework, or the overall visual direction before implementation. After a visual change, inspect narrow and desktop layouts, keyboard operation, visible focus, and all six themes. A successful build alone is not visual acceptance.


## 11. Current writing timeline (2026-11-21)

The Writing archive uses a reverse-chronological vertical timeline. A fine theme-aware line and small muted nodes sit between the date rail and the article text. Place a small sequence number immediately before each node with a little breathing room; each row shows its date, title, summary, and reading time. Use a short underline below article content rather than a full-width separator, and never let the separator cross the timeline rail. Keep the presentation editorial and quiet: no year dividers, filled cards, category chips, or decorative icons. The whole row remains a keyboard-accessible link with visible focus. On narrow screens, reduce the date and node gutters while preserving the same order and alignment.

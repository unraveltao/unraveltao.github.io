# Content Validation Tests

`pnpm test` runs the `*.test.mjs` files in this directory with Node's built-in `node:test`. The suite has no extra test-framework dependency.

## Current coverage

```text
tests/
├── README.md
└── content-rules.test.mjs
```

`content-rules.test.mjs` covers the pure functions in `scripts/lib/content-rules.mjs`: scalar frontmatter parsing, series existence, duplicate series order, featured-post count, and update dates.

Tests use inline objects rather than reading the content tree. This keeps each case focused on the rule under test; disk access belongs to `scripts/validate-content.mjs`.

## Why the suite is small

This is a static site without a server API or persistent runtime state. Most content correctness is checked by:

1. Velite schema validation, which stops the build on invalid fields.
2. `scripts/validate-content.mjs`, which checks cross-file rules.
3. `pnpm build`, which exercises route generation and static output, RSS, and sitemap generation.

The unit tests focus on pure validation logic that is not fully covered by those build checks. They test the guardrails themselves, not the whole website.

## Prototype-chain regression

`checkSeriesExists` must use an own-property check. A previous implementation used `key in registry`, which allowed values such as `constructor`, `toString`, `hasOwnProperty`, and `__proto__` to pass through the prototype chain. `Object.hasOwn` prevents this regression.

Do not change the implementation back to `in`; the regression case exists to prevent that specific bug.

## Test command

```bash
pnpm test
```

The package script runs `node --test "tests/**/*.test.mjs"`. Keep the glob quoted so Node expands it consistently on Windows. Running `node --test tests` can treat the directory as a module entry point on Node 22 for Windows and fail with `MODULE_NOT_FOUND`.

## What is not tested here

- Visual appearance: inspect the site at 375px and desktop widths, and check all themes manually.
- Lighthouse scores: they vary by environment. Product acceptance criteria are in [Product Requirements](../docs/02-Product-Requirements.md).
- React Router internals: a successful production build is the current integration check.
- Generated-file existence as a separate smoke test: add this only if build complexity makes the current checks insufficient.

## When to add coverage

Add focused tests when a validation rule has needed a temporary exception, the same bug has recurred, or publication filtering and project sorting in `app/lib/content.ts` or `app/lib/publish.ts` change. If testing typed logic requires extracting a pure function, prefer that over adding a framework dependency for a small suite.

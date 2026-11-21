# Maintenance Plan

> Updated on 2026-11-22. The Blog is a small, personally maintained static website. This document describes maintenance policy, not a feature roadmap or release schedule.

## Current maintenance approach

The final project closeout is tracked in Linear milestone **M6 — Documentation & Project Closeout**. It covers the documentation audit, README and agent guidance, and the Markdown-first Post authoring format. Once M6 is complete, routine work returns to writing and small maintenance fixes; no additional product milestone is currently planned.

Keep the site small. Reopen implementation work for a reproducible bug, a clear usability problem, or a concrete author or reader need. Do not add features to fill a roadmap.

## Tracking changes

- A typo, formatting correction, or small edit to one Post usually needs only a focused commit.
- A batch of Posts that forms one publication can share one content change.
- Use a Linear Issue as a personal checklist when work spans several files or needs decisions. Tracking does not imply that the repository accepts outside contributions.
- Use a GitHub PR when a change benefits from a reviewable diff, preview, or automated checks before merge. PRs are a maintenance and verification tool, not an invitation to contribute.

Do not create an Issue or PR for every post. Keep the process proportional to the change.

## Current safeguards

- Pushes to `main` run `.github/workflows/deploy.yml`, which validates, builds, and deploys the static site to GitHub Pages.
- Vercel provides preview deployments for branches and PRs; inspect the preview before merging a user-visible change.
- Velite validates content frontmatter. The content validator checks cross-file Post rules and rejects duplicate `index.md`/`index.mdx` sources within one Post directory.
- Human review remains necessary for factual accuracy, prose, alt text, and visual behavior.

## Conditional follow-up

| Possible work | Trigger |
|---|---|
| Improve authoring tools | Repeated friction not addressed by Markdown, frontmatter validation, or the existing local workflow |
| Per-post social images | Distinct previews show clear value that justifies manual assets or build complexity |
| Search, analytics, or comments | A concrete reader need outweighs extra scripts, third-party requests, privacy considerations, and maintenance |
| Performance budget automation | A measured regression or recurring difficulty maintaining the documented gzip budget |

These are conditional options, not commitments. Continue with the current static setup unless real use provides a reason to change it.


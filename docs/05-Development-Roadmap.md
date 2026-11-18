# Maintenance Plan

> Updated on 2026-11-19. This is a lightweight maintenance guide, not a milestone schedule. The site is a small, personally maintained static website; it has no fixed release cadence or feature-count target.

## Current maintenance approach

Keep the repository documentation clear, accurate, and consistent in English across the README, `AGENTS.md`, and the technical documents. The existing filenames are already descriptive and follow stable conventions (`README.md`, `AGENTS.md`, numbered English filenames under `docs/`, and numbered ADR filenames); do not rename them without a concrete usability benefit.

The next planned pass is a bounded review of UI and small functional improvements. Each change should address an observed problem and have a simple acceptance check. Do not turn this review into a broad redesign or add features just to make the site larger.

Once those closeout tasks are complete, the default maintenance scope is posts and documentation. Reopen implementation work for a specific bug, a clear usability problem, or a concrete new need.

## Tracking changes

- A typo, formatting correction, or small edit to one post usually needs only a focused commit.
- A batch of posts that forms one publication can share one content commit.
- Use an Issue as a personal checklist when a task spans several files or needs decisions. An Issue does not imply that the repository accepts outside contributions.
- Use a PR when a change benefits from a reviewable diff or automated checks before it is merged. PRs are a maintenance and verification tool, not a contribution invitation.

Do not create issues or PRs for every post. Keep the process proportional to the change.

## Current safeguards

- Pushes to `main` build and deploy the static site through `.github/workflows/deploy.yml`; the workflow can also be started manually.
- Content schema and the four cross-file rules are checked during build. Custom slug collisions, body headings, internal-link slashes, and local image references are not all automatically checked in the current baseline.
- Factual accuracy, typos, and image meaning still need human review.

## Conditional follow-up

Consider a change only when its trigger is met:

| Possible work | Trigger |
|---|---|
| Markdown instead of MDX | First confirm whether Posts or Projects use MDX-only syntax; migrate only if the simpler format has a clear maintenance benefit. Update the schema pattern and documentation together. |
| New content tooling | Repeated authoring friction that the current schema and validator do not address |
| Per-post social images | A demonstrated need for distinct sharing previews that justifies extra build complexity or manually maintained assets |
| Search, analytics, or comments | A concrete reader need that outweighs extra scripts, third-party requests, privacy considerations, or maintenance |
| Performance budget automation | A measured regression or repeated difficulty keeping the documented 130KB gzip budget |

Do not treat these items as planned milestones. Keep the site small unless real use provides a reason to expand it.

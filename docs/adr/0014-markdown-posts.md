# Prefer Plain Markdown for Post Authoring

**Status:** Accepted  
**Date:** 2026-11-22

## Context

Posts are text-first articles managed in Git. A source review found no embedded React components or other MDX-only authoring needs in the published Post. Requiring `.mdx` adds a format distinction without providing a current feature benefit. The author wants to write posts using standard Markdown, while older files should remain readable during migration.

## Decision

- Use `content/posts/<slug>/index.md` for new Posts.
- Keep `index.mdx` accepted as a compatibility extension for existing Posts.
- Allow exactly one Post source file per slug directory; the content validator reports directories containing both extensions.
- Keep Projects on their existing `index.mdx` format. This decision changes Post authoring only.
- Preserve frontmatter schema, published slugs, dates, image references, and rendered HTML behavior when changing a file extension.

## Alternatives Considered

### Keep `.mdx` as the only Post format

This requires no migration, but keeps a more capable syntax than ordinary article content needs and does not match the author's preferred editor format.

### Remove `.mdx` support immediately

This creates unnecessary risk for older or locally maintained Posts. Supporting both extensions during transition is a small compatibility cost.

## Consequences

New articles can be created and edited as standard Markdown files. The Velite glob and content validator must support both extensions and reject duplicate files for one slug. MDX components are not part of the Post authoring contract; revisit only if a concrete article feature requires them.


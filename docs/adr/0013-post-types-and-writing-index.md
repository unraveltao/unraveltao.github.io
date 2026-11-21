# Use Four Explicit Post Categories Separate from Topic Tags

**Status:** Accepted  
**Date:** 2026-11-22

## Context

The Writing index and Personal OS need stable editorial groupings. Topic tags describe subject matter and should remain independent from the kind of writing. Series are useful for genuine ordered sequences, but using them as broad categories would conflate two different relationships.

## Decision

- Keep Post and Project as the only content entities.
- Require each Post to select one registered category: `thinking`, `review`, `skill`, or `log`.
- Keep category labels and ordering in `content/post-categories.json`; keep topical tags in Post frontmatter.
- Use a Post's explicit category to populate Personal OS pages. Do not infer category from its title, body, tags, or series.
- Reserve Series for genuinely ordered reading sequences and require a positive `order` for every Post in a series.
- Preserve compatibility for legacy `type: thinking` and `type: retrospective` frontmatter while Posts are migrated.

## Consequences

The category taxonomy is small and author-curated. Adding a new category requires changing the registry and reviewing the corresponding UI. The model avoids another content collection and keeps writing, tags, and ordered series distinct.


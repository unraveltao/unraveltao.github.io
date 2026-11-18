# Add Project as a Second Content Entity

The site adds `/projects/` to present completed or ongoing work. Project is an independent collection stored at `content/projects/<slug>/index.mdx` with its own schema. This partially supersedes [ADR-0005](./0005-post-only-content-model.md).

**Considered Options**: A `kind: project` field on Post would combine two meanings in one schema, leave fields such as `status`, `stack`, and `repo` empty on many records, and place projects in RSS, tag counts, and the post list. Treating projects as a Series would not represent their status, technology stack, or external links.

**Consequences**: Routes, navigation, sitemap, and social metadata now account for two entities. Projects remain outside RSS and tag filters, limiting the branching cost. A small portfolio can look sparse when it contains only one Project; this is accepted because visitors need to see real work.

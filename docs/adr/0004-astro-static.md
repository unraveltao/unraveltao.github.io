# Use Astro Static Output Instead of Next.js

> Superseded by [ADR-0011](./0011-vite-react-router.md) on 2026-10-31. The rationale below is historical and explains the preference for minimal JavaScript before the framework migration.

The site used Astro 5 Content Collections with `output: 'static'`, producing HTML and CSS with little client-side JavaScript. Default-zero-JavaScript rendering suited a content site, while the Zod schema caught frontmatter errors during the build. Next.js static export would disable features such as ISR, Server Actions, and Route Handlers, trading a heavier framework for fewer capabilities.

**Considered Options**: Eleventy and Hugo were lighter but had weaker support for the desired MDX components, TypeScript, and image pipeline. Next.js made sense only if maintaining a single React mental model outweighed the static-site benefits.

**Consequences**: Server-dependent features such as API search, comment backends, and draft previews would require a third-party service or build-time generation. Astro components were not React components, so interactive islands required learning a separate model. The stack later changed; see ADR-0011 for the current trade-off.

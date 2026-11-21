# Store MDX in the Repository and Publish Through Git

> Superseded for Post authoring by [ADR-0014](./0014-markdown-posts.md). This record preserves the original repository and Git publishing rationale.

Posts are `.mdx` files under `content/`. Velite validates their frontmatter at build time, and pushing to `main` triggers deployment. There is no CMS, database, or administration backend. Git review and direct editing by the maintainer and agents are the main reasons for keeping content in the repository.

**Considered Options**: Sanity or synchronized Notion content could improve phone-based writing and collaboration, but would add an external service, a preview path, and possible schema drift. For a low-frequency, single-maintainer site, the benefits do not justify the extra failure modes.

**Consequences**: Writing on a phone requires the GitHub web editor or a local clone. Images are stored in the repository; if their size becomes a problem, external object storage may need consideration.


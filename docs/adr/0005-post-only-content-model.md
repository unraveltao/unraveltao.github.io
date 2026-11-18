# Start with Posts as the Only Content Entity

The initial content model had one entity: Post. Notes were excluded from the first version, Series were derived from the `series` and `order` fields, and Projects were initially considered a Post field. Every additional entity would create branching behavior across navigation, lists, RSS, sitemap, social metadata, and structured data.

**Consequences**: Short thoughts either become Posts or remain unpublished. Adding Notes later would require a route split such as `/posts/` and `/notes/`, although the existing post files could remain unchanged. [ADR-0007](./0007-project-as-second-entity.md) later introduced Project as a second entity.

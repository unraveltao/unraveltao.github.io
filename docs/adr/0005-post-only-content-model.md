# 只有一种内容类型：Post

站内唯一的内容实体是 Post。Note 不进 v1；Series 由 frontmatter 的 `series` + `order` 派生，Project 退化为 Post 上的一个字段。每多一个内容类型，导航、列表、RSS、sitemap、OG 图、结构化数据都要分叉一遍——这是乘法成本，不是加法。

**Consequences**：短想法只能写成 Post 或者干脆不发；将来若要加 Note，需要在路由层做一次迁移（`/posts` 与 `/notes` 并列），但已有的内容文件本身不用动，所以这个决定是可逆的、只是要还一次债。

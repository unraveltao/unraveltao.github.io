# 引入 Project 作为第二种内容实体

站点增加 `/projects` 展示做过的项目。Project 是独立的 content collection（`content/projects/<slug>/index.mdx`），有自己的 schema，不再是 Post 上的一个字符串字段。这**部分取代 [ADR-0005](./0005-post-only-content-model.md)**。

**Considered Options**：把 `kind: project` 加在 Post 上（一套 schema 两种语义）——会让 `status` `stack` `repo` 这些字段永远有一半为空，且项目会混进 RSS、标签计数和 `/posts` 列表；复用 series 把项目当系列页——系列是"文章的排序"，没有状态、技术栈、外部链接这些项目独有的维度。

**Consequences**：内容实体从一种变成两种，路由、导航、sitemap、OG 都要多考虑一条分支。但项目**不进 RSS、不进标签**，所以分叉成本比 ADR-0005 担心的"乘法"要小。另一个代价：只有 `lattice` 一个项目时，`/projects` 会显得单薄——接受这一点，因为"做过什么"是访客（尤其招聘方）最想知道的事，比一个空着的栏目有用。

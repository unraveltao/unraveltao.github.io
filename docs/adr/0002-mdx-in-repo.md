# 内容以 MDX 存仓库，commit 即发布

文章是 `content/` 下的 `.mdx` 文件，frontmatter 由 schema 校验，推到 main 即触发构建发布。没有 CMS、没有数据库、没有后台：写作流程必须能被 git 审阅、被编辑器与 agent 直接读写，这是选 MDX 而不是 headless CMS 的唯一理由。

**Considered Options**：Sanity / Notion 同步在手机写作和协作上更强，但引入外部服务、预览链路和 schema 漂移；本站在单人维护、低频更新的前提下，收益抵不上多出来的故障面。

**Consequences**：手机上写作只能走 GitHub 网页编辑器或本地 clone；图片必须进仓库，体积增长后需要换成对象存储。

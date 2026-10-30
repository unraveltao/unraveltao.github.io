# Blog

一个以工程叙事为主的个人站点：把 `lattice` 这类项目的设计取舍写清楚，让同行看懂、让招聘方在五分钟内做出判断。

## Language

**Post**：
一种内容实体，一篇带标题、带结论、可被外部引用的文章。与 Project 并列，两者互不包含。
_Avoid_: Article、Entry、博文、日志

**Series**：
若干 Post 的有序集合，用于把一个项目拆成多篇连载；本身不是实体，只是 Post 上的 `series` + `order` 两个字段。
_Avoid_: Collection、合集、专栏

**Tag**：
Post 上的无层级横切分类，纯字符串，没有描述、图标或颜色。
_Avoid_: Category、分类、标签云

**Featured**：
被指定上首页精选轨的那一篇 Post；全站最多一篇，没有就是没有，不留空位。
_Avoid_: Pinned、置顶、推荐

**Draft**：
尚未发布的 Post。本地开发可见，构建产物、RSS、sitemap 里都不存在。
_Avoid_: Unpublished、草稿箱

**Published**：
`date` 已到且非 Draft 的 Post。只有 Published 会出现在任何对外页面上。
_Avoid_: Live、已上线

**Project**：
站内第二种内容实体，代表"做过的一个东西"：名称、一句话、状态、技术栈、仓库/演示链接。与 Post 是并列关系，不是 Post 的分类，也不属于任何 Series。
_Avoid_: Repo、作品、案例、Portfolio Item

**theme**：
仅指**明暗两态**（`light` / `dark`），由 `<html data-theme>` 控制，跟随系统偏好并可被用户覆盖。站内不存在第二层含义。
_Avoid_: 主题（当你想说"视觉风格"时）

**preset**：
"视觉风格预设"（如 minimal / developer / editorial / dashboard）。**当前不做**，仅作为天花板保留在文档里。若将来实现，它只换 token，不换布局。
_Avoid_: 主题、皮肤、skin

**locale**：
界面与内容的语言。本站只有 `zh-CN`；英文只出现在 `titleEn` / `summaryEn` 两个元信息字段里，不构成第二个 locale。
_Avoid_: 语言版本、双语版

**publish / 发布**：
本站的"发布"只有一个含义：`git push` 到 `main`，GitHub Actions 构建并部署。
_Avoid_: 推送到平台

**推送（publishing pipeline）**：
把文章发到公众号、知乎等外部平台的流程。**属于另一个项目，与本仓库无关**，不共享代码、部署或数据，只可能共享同一篇文章的文本。
_Avoid_: 本站的发布、博客发布


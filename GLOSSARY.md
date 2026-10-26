# Blog

一个以工程叙事为主的个人站点：把 `lattice` 这类项目的设计取舍写清楚，让同行看懂、让招聘方在五分钟内做出判断。

## Language

**Post**：
站内唯一的内容实体，一篇带标题、带结论、可被外部引用的文章。
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

# unraveltao

以个人主页和项目展示为主、精选技术写作为补充的个人站点。

## Language

**Post**：
一种内容实体，收录重要方法论、技术取舍与实践总结，包含明确且有支撑的结论。与 Project 并列，两者互不包含。
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
站内第二种内容实体，代表"做过的一个东西"：名称、一句话、状态、技术栈，以及仓库 / 文档 / 演示三个可选外链。与 Post 是并列关系，不是 Post 的分类，也不属于任何 Series。
_Avoid_: Repo、作品、案例、Portfolio Item

**theme**：
`<html data-theme>` 上的一次外观选择。当前六套：spring / summer / autumn / winter / geeker / hacker，唯一真源是 `app/lib/theme.ts` 的主题数组，值写在 `app/styles/garden-themes.css` 与 `global.css` 的 `[data-theme]` 块里，选择结果存 `localStorage`。明暗不再是独立开关——`geeker` 与 `hacker` 承担纸白与终端两档底色。
_Avoid_: 皮肤、skin、preset（那是另一层，见下）

**preset**：
"视觉风格预设"（minimal / developer / editorial / dashboard）这一**层**，当前不做，仅作为天花板保留（ADR-0003）。六套 `theme` 是已实现的现状、并登记为与规范的偏差，不等于 `preset` 已经落地：真要做 `preset`，只换 token、不换布局，且与 `theme` 分属两个变量层。
_Avoid_: 主题、皮肤

**locale**：
界面与内容的语言。本站只有 `zh-CN`，不存在第二个 locale，也没有任何英文元信息字段（ADR-0009 删掉了 `titleEn` / `summaryEn`）。
_Avoid_: 语言版本、双语版

**publish / 发布**：
本站的"发布"只有一个含义：`git push` 到 `main`，GitHub Actions 构建并部署。
_Avoid_: 推送到平台

**推送（publishing pipeline）**：
把文章发到公众号、知乎等外部平台的流程。**属于另一个项目，与本仓库无关**，不共享代码、部署或数据，只可能共享同一篇文章的文本。
_Avoid_: 本站的发布、博客发布

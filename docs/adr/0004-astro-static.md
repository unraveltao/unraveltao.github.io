# 用 Astro 静态输出，不用 Next.js

站点用 Astro 5 的 Content Collections 构建，`output: 'static'`，产物只有 HTML/CSS 和极少量 JS，没有常驻服务端。选它是因为内容型站点的"默认零 JS"是真实收益，而 content schema（zod）在构建期就拦住 frontmatter 错误——这正好补上了没有 CMS 之后缺失的字段校验。Next.js 的静态导出会把 ISR、Server Actions、Route Handler 全部关掉，等于用更重的框架换更少的能力。

**Considered Options**：Eleventy / Hugo 更轻，但 MDX 组件、TS 类型和图片处理链都更弱；Next.js 只在"团队只想维护 React 一套心智模型"时成立。

**Consequences**：任何需要服务端的能力（搜索 API、评论后端、草稿预览）都只能走第三方服务或构建期生成；`.astro` 文件不是 React 组件，写交互岛需要单独适应。

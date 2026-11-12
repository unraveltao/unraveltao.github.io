# AGENTS.md

## 项目边界

- 本仓库是 Vite 7 + React Router 7 + Velite 的静态个人网站；内容与页面代码分离。
- 内容只有 Post 与 Project。文章放在 `content/posts/<slug>/index.mdx`，项目放在 `content/projects/<slug>/index.mdx`。方法论复用 Post + Series，不新建 Content Collection。
- `app/` 放路由、组件、共享逻辑与样式；`public/` 放站点级资源；`scripts/` 和 `tests/` 维护构建与内容校验。
- `.velite/`、`.react-router/`、`build/` 是生成目录，不手工编辑。

## 内容规范

- frontmatter 字段与校验以 `velite.config.ts` 为唯一真源。Post 必须提供标题、20–160 字 `summary`、日期和 1–3 个 kebab-case 标签。
- Personal OS 文章使用 `series: personal-os` 和正整数 `order`；入口导航从已发布文章自动生成。添加模块不应要求修改页面代码或路由。
- 正文不用 `h1`，标题从 `h2` 开始且不跳级；代码块标语言，图片用同目录相对路径并提供描述性 `alt`，站内链接带尾斜杠。方法论 SVG 可集中放在 `public/assets/` 并用 `/assets/<name>.svg` 引用。
- 已发布 slug 与日期保持稳定。不得擅自删除、覆盖或改写现有文章及图片；确有明确任务要求时只改指定内容。
- 不编造个人经历、项目事实或效果。未验证的做法和结果应明确标为待验证。

## 实施边界

- 页面只通过 `app/lib/content.ts` 读取内容；发布判定只使用 `app/lib/publish.ts`。
- 主题继续复用现有六套主题系统。色值只在 `app/styles/` token 定义中写；新增样式遵守现有组件约定，焦点必须可见。
- 不引入依赖、第三种内容实体、数据库或 CMS；不做无关重构、批量重命名或格式化。
- 页面行为变更同步更新 `docs/02-Product-Requirements.md`；维护入口、构建或预渲染行为变更同步更新 `docs/04-Technical-Architecture.md`。视觉规格有变化时同步 `docs/03-Design-System.md`。
- 静态页面同时登记 `app/routes.ts` 与 `react-router.config.ts` 的 prerender 清单。动态文章由内容数据生成。所有公开 URL 使用尾斜杠。
- 保留 `routeDiscovery: { mode: 'initial' }`、CSS 内联后保留 assets CSS，以及主题同步初始化与 hydration 恢复逻辑。

## 验证与发布

```bash
pnpm test
pnpm build
pnpm preview
```

`pnpm build` 包含内容校验和 TypeScript 检查。页面改动还需检查窄屏布局、键盘可操作性、主题显示及尾斜杠 URL。不要声称未实际完成的检查已通过。

发布分支是 `main`，部署由 `.github/workflows/deploy.yml` 执行。检查并仅提交当前任务文件；禁止 force push、`--no-verify` 和覆盖他人工作。GitHub HTTPS 异常时可用既定 SSH 远程：

```bash
git push git@github.com:unraveltao/unraveltao.github.io.git main
```

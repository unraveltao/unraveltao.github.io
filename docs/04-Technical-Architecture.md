# 维护说明

> 2026-11-02。日常操作见 README，页面与字段意图见产品需求，历史决策见 docs/06。

## 1. 目录与修改入口

| 位置 | 职责 | 什么时候改 |
|---|---|---|
| app/routes.ts | 显式路由表 | 增减页面 |
| app/routes/ | 页面、meta 与局部交互 | 改内容展示 |
| app/components/ | 复用界面 | 导航、列表项、目录等 |
| app/lib/content.ts | 内容读取、发布过滤、项目排序 | 内容访问行为 |
| app/lib/publish.ts | 文章发布判定唯一实现 | 草稿、日期规则 |
| app/lib/site.json | 身份、站点 URL、描述与 GitHub | 站点信息 |
| app/lib/seo.ts | title、canonical、OG | 页面元数据 |
| app/lib/theme.ts | 主题与同步初始化脚本 | 主题行为，需防闪烁验证 |
| app/styles/ | garden.css、garden-themes.css、global.css | 现有样式，偏差见设计系统 |
| content/ | Post、Project、系列说明 | 写作与项目更新 |
| velite.config.ts | 两种内容 schema、正文渲染与高亮 | 字段及 Markdown 管线 |
| react-router.config.ts | 发布内容的预渲染清单 | 新增静态页时同步 |
| vite.config.ts | 开发期内容重建、路径别名 | 开发流程 |
| scripts/lib/content-rules.mjs | 跨文件校验纯函数 | 与 tests/ 同步修改 |
| scripts/postbuild.mjs | 内联 CSS、404、RSS、sitemap | 静态产物行为 |
| scripts/serve.mjs | Pages 风格预览 | 301、404 与静态响应 |

当前规模保留浅层目录，不增加空的 features、services、hooks 层。页面私有逻辑先与页面放一起，重复或存在独立规则时再抽取。生成目录 build、.velite、.react-router 不手工编辑。

## 2. 构建与校验

pnpm build 依次执行 Velite → 跨文件校验 → React Router 类型生成 → TypeScript → 预渲染 → postbuild。任何失败均中止。

Velite strict 校验单文件字段；scripts/lib/content-rules.mjs 检查系列是否存在、系列顺序重复、非草稿精选数量及修改日期。判系列自有键用 Object.hasOwn。pnpm test 用 Node 内置测试运行这些规则。pnpm check 可单独检查类型，dev 只转译不检查。

运行时内容均已构建固化；内容从 content.ts 读取，不在新页面复制发布过滤。系列排序目前仍在页面中，后续有相关改动再收敛。默认框架服务端入口使用 @react-router/node 与 isbot，不因 app/ 没有显式 import 就删依赖。

## 3. 部署与 URL

main 推送触发 .github/workflows/deploy.yml：Node 22、pnpm 9，安装锁定依赖，测试与构建，通过后部署 build/client 到 GitHub Pages。无需另设部署服务。

所有页面对外 URL 带尾斜杠，seo.ts 统一规范化 canonical；文章 JSON-LD 同样带尾斜杠。站点域名从 site.json 读取，postbuild 的 RSS 与 sitemap 使用同一配置。新增静态页面要同时登记 routes.ts 和 prerender；动态文章、项目、系列由内容推导。Workflow 和 Workshop 本轮只移除主入口，仍预渲染原地址。

## 4. 需要保留的约定

- routeDiscovery 使用 initial：Pages 没有 /__manifest 服务。
- CSS 全量内联后保留 assets/*.css：客户端导航仍会引用。
- Velite 不清空输出目录：构建配置直接读取其中 JSON。
- 主题脚本在 head 同步执行，并保留 hydration 后恢复属性的逻辑；root 和 ThemeProvider 的重复恢复需浏览器验证后再合并。
- 不使用 text-rendering: optimizeLegibility，旧性能原因保留在决策记录。
- 预览用 pnpm preview，不用 vite preview；代理导致 GitHub 502 时按 AGENTS 中方法使用直连。

## 5. 内容维护

内容在仓库内写作，字段以 schema 为准，正文不是可 hydrate 的 React 组件。发布文章只在实质修改时填写 updated；不改已发布 slug 或 date。图片同目录，alt 必填。Project 不含日期、不进 RSS。RSS 生成最多 20 篇已发布文章的全文。

首页使用已有项目 order 和文章 featured，避免第二份策展配置。普通文章无需进首页，不以更新频率决定精选。

项目详情的相关文章从 getPublishedPosts() 按 Post.project 关联，继承发布过滤与日期排序；repo、docs 与 demo 分别按值显示，缺项不渲染对应入口，不使用 Workshop 作为缺失链接的替代。详情移除装饰窗口图，作者来自 SITE_AUTHOR；真实截图与贡献材料仍待作者提供。

## 6. 性能与依赖

首屏 JS gzip 上限 130KB。2026-11-02 定位调整前测得首页所引用 JS 文件（含 modulepreload 与 manifest，去重后逐文件 gzip 求和）129.32KB，已接近预算；定位调整后同口径测得 129.536KB（约 129.54KB），比调整前增加约 0.22KB，主要变化为中文展示文案与 URL 规范化；未新增依赖。Lighthouse 待新版重测，不使用 Astro 时期分数作为当前结论。

同口径（首页 HTML 引用的全部 `.js`，去重逐文件 gzip）复测于文档同步这一轮：首页 13 个文件 **122.67KB**、项目详情页 10 个文件 119.15KB，`assets/` 里共 22 个 JS 文件但多数未被首页引用。比上一轮的 125.594KB 低，差异来自删除两篇文章后的内容分块变化；两次数字都低于 130KB，本轮无新增依赖。重测脚本没有固化进仓库，口径以本段描述为准。

新增依赖先判断：平台能否完成、能否只在构建期执行、首屏预算能否承受。没有第三方 UI、主题、状态、动画、图标或日期库；本轮无新增依赖。

## 7. 已知缺口

- 六套主题、卡片与样式色值散落，仍与 AGENTS、ADR-0003 不一致。本轮保留外观，不追认这些偏差；后续独立收敛视觉。
- Workshop/DownloadNote 的导出字段与 Post schema 不同，Workshop 写入正文 h1；暂不作为直接可发布的文章生成器。
- 自定义 slug 重复、标题层级、图片缺失与体积未全部自动校验。
- OG 图仍共用 public/og.png；没有新建文章脚手架、格式化或 lint 命令（是否引入的结论与触发条件见 `docs/05` 的"工具链与 SEO 复核"）。
- 首屏 JS 的 130KB 预算没有自动闸门：`scripts/postbuild.mjs` 只打印首页 HTML 大小，不计算首屏 JS gzip，超限不失败，靠人盯 §6 的记录。
- 项目真实截图、演示、贡献与成果材料需作者提供，不由 agent 补造。
- 配置中的示例邮箱没有作为联系入口展示；GitHub 链接有效。

## 8. 本轮清理记录

移除无人调用的 posts.ts 工具、空 Page collection/getPage、SITE_EMAIL 与 formatDate 的无用导出，以及 postbuild 内只写不读的 usedCss 集合。保留实际使用的日期格式函数、CSS 产物、框架依赖与既有路由。没有批量搬动源码。

## 9. 本轮验证

pnpm test 27/27、pnpm check、pnpm build 通过；11 个页面预渲染，额外生成根 404.html。产物检查确认首页精选区域不含占位文、主导航无 Workshop、12 份 HTML 的 canonical 均带尾斜杠。

本环境的本机预览连接超时，375px 无横向滚动、键盘流程及实时 301/404 响应尚未完成验收；不能用静态产物检查替代这些检查。

### 项目详情修正验证（2026-11-02）

27 项测试与完整构建通过。产物检查确认 Lattice 详情有两篇关联文章、无无关文章、无 Workshop 替代演示、无装饰窗口图，且只保留一个 h1。本轮同口径 JS gzip：首页 129.646KB、项目页 126.018KB；首页较上一轮增加约 0.11KB（关联功能带来共享分块与 manifest 变化），均低于 130KB，无新增依赖。375px 与键盘浏览器验收仍未完成；真实案例材料待作者提供。

### Lattice 仓库材料核对（2026-11-02）

依据作者提供的 https://github.com/unraveltao/Lattice 及其中 README.zh-CN.md、docs/ARCHITECTURE.md，项目介绍改为 Windows 桌面组件平台，补齐 repo 字段，链接仓库真实截图与架构说明；没有复制未经确认的贡献或量化成果。旧文章里的编辑器事故和数字仍需作者确认。27 项测试、完整构建、源码链接产物检查通过；首页 JS gzip 129.95KB。未新增依赖，未改文章 slug/date。

### 删除虚构文章（2026-11-02）

作者确认两篇 Lattice 文章中的经历与数字并非事实，已删除 lattice-architecture、tauri-state-machine 及 lattice-teardown 系列配置。上述历史验证中关于两篇文章和待核实数字的描述已失效，不得再作项目事实引用。仅保留 Hello World 与经仓库核对的 Lattice 项目。

27 项测试、完整构建通过，生成 8 个页面、RSS 1 条、sitemap 7 条。产物检查确认旧页面不存在，首页、文章列表、项目详情、RSS、sitemap 无旧 slug；无精选时首页写作区隐藏，无关联文章时项目写作区隐藏。首页 JS gzip 125.594KB。删除的公开 URL 在部署后返回 404，不增加重定向或占位页；本地改动尚未部署。

### 文档同步与项目文档入口（2026-11-02，当前状态）

范围：README 重写为项目入口；AGENTS 与 GLOSSARY 的失效条款按实现现状校准（视觉条款改为约束新增样式 + 指向偏差登记，`tokens.css` / `.module.css` / 单一强调色 / 121.8KB / 远端分支等失真处改正）；`tests/README`、`docs/03` §10、`docs/06` 索引的失效指针修正；Project schema 增加可选 `docs` 外链，详情页按值渲染"查看文档"。工具链与 SEO 的评估结论记在 `docs/05`，本轮未新增依赖。

验证：`pnpm validate` 通过（1 篇、0 系列、0 精选），`pnpm test` 27/27，`pnpm check` 零错误，`pnpm build` 退出码 0——8 个页面预渲染、内联 8 段 CSS、RSS 1 条、sitemap 7 条、额外生成根 `404.html`；首页 JS gzip 122.67KB、项目详情页 119.15KB。本轮 `pnpm preview` 可用（上一轮超时）：`/projects/lattice/` 返回 200 且含"项目文档 / 查看文档"，缺尾斜杠 301，未知路径 404，`rss.xml` 与 `sitemap-index.xml` 均 200。

负例检查：lattice 未填 `demo`，详情页不出现"在线演示"行；项目列表页不出现"查看文档"；无 featured 时首页只剩 01 区块。375px 无横向滚动、键盘全流程与 Lighthouse 重测仍未做，不能用上述产物检查替代。本地改动尚未部署，也未推送。

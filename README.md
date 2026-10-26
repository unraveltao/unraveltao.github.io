# Blog

一个以工程叙事为主的静态个人博客。Astro + MDX，commit 即发布，无后端。

**状态**：M0 骨架 + M1 内容管线已跑通（`pnpm build` 产出 16 个页面），部署到 GitHub Pages 用户站点 `unraveltao.github.io`。

## 文档

| 文档 | 内容 |
|---|---|
| [docs/design.md](docs/design.md) | **主设计文档**，从定位到里程碑，先看这份 |
| [docs/information-architecture.md](docs/information-architecture.md) | 路由、页面组成、Feed 与 SEO |
| [docs/content-model.md](docs/content-model.md) | 字段定义、schema、构建期校验、写作流程 |
| [docs/design-system.md](docs/design-system.md) | 颜色/字号/间距 token 与组件规格 |
| [GLOSSARY.md](GLOSSARY.md) | 术语表：Post / Series / Tag / Featured / Draft |
| [docs/adr/](docs/adr/) | 五个架构决策及其取舍 |

## 核心约束

- 只有一种内容类型：**Post**
- URL 里没有日期，slug 发布后永不修改
- 零卡片、零阴影、单一强调色 `#0F6E56`
- 构建期校验失败即构建失败

## 本地运行（M0 之后）

```bash
pnpm install
pnpm dev      # http://localhost:4321
pnpm build    # 输出 dist/
```

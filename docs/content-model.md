# 内容模型

> 决策来源：ADR-0002（MDX 存仓库）、ADR-0005（只有 Post 一种类型）。
> 路由映射见 [information-architecture.md](./information-architecture.md)。

## 1. 唯一实体：Post

站内只有 Post 一个内容实体。Note 不存在；Series 与 Project 都是 Post 上的字段，不是独立对象。

## 2. 文件布局

```
content/
├── posts/
│   └── tauri-state-machine/        ← 目录名 = slug
│       ├── index.mdx
│       ├── fig-01-state-graph.png
│       └── fig-02-timeline.png
├── pages/
│   └── about.mdx
└── series.json                     ← 系列 slug → 显示名/描述的对照表
```

图片与文章**同目录**：删文章 = 删一个文件夹，图片不会变成孤儿；MDX 里用相对路径引用（`![状态图](./fig-01-state-graph.png)`），构建期自动优化。

## 3. Frontmatter 字段

| 字段 | 类型 | 必填 | 默认 | 说明 |
|---|---|---|---|---|
| `title` | string | ✓ | — | 中文标题，≤ 40 字 |
| `summary` | string | ✓ | — | 一句话结论，20–80 字。同时作为列表摘要与 `meta description` |
| `date` | `YYYY-MM-DD` | ✓ | — | 首次发布日；晚于构建日则视为未发布 |
| `updated` | `YYYY-MM-DD` | | — | 只有**实质性修改**才填，改错别字不填 |
| `slug` | string | | 目录名 | kebab-case，发布后永不修改 |
| `tags` | string[] | ✓ | — | 1–3 个，小写 kebab-case |
| `series` | string | | — | 系列 slug，必须在 `series.json` 中存在 |
| `order` | number | | — | 有 `series` 时必填，从 1 开始，整数 |
| `project` | string | | — | 关联项目标识（如 `lattice`），仅用于展示 |
| `featured` | boolean | | `false` | 首页精选轨；**全站最多 1 篇** |
| `draft` | boolean | | `false` | `dev` 可见并带角标，`build` 排除 |
| `titleEn` | string | | — | 仅用于 OG 卡片与英文摘要，缺失则回落中文 |
| `summaryEn` | string | | — | 同上 |
| `cover` | image | | — | 相对路径；不填时 OG 图用纯文字模板 |

`series.json` 结构（唯一一个非 Post 的数据文件，只是一张标签表，没有生命周期）：

```json
{
  "lattice-teardown": { "name": "lattice 拆解", "description": "把一个 Tauri 应用从架构到落地拆开看。" }
}
```

## 4. Schema 草案

```ts
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/);

const posts = defineCollection({
  loader: glob({ pattern: '**/index.mdx', base: './content/posts' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().max(40),
        summary: z.string().min(20).max(160),
        date: z.coerce.date(),
        updated: z.coerce.date().optional(),
        slug: slug.optional(),
        tags: z.array(slug).min(1).max(3),
        series: slug.optional(),
        order: z.number().int().positive().optional(),
        project: z.string().optional(),
        featured: z.boolean().default(false),
        draft: z.boolean().default(false),
        titleEn: z.string().optional(),
        summaryEn: z.string().optional(),
        cover: image().optional(),
      })
      .refine((p) => !p.series || p.order !== undefined, {
        message: 'series 存在时 order 必填',
        path: ['order'],
      }),
});

export const collections = { posts };
```

## 5. 校验规则（构建期，违反即失败）

1. `summary` 为空或 < 20 字 → 失败；> 160 字 → 失败（超出会被搜索引擎截断）。
2. `series` 有值但 `order` 缺失 → 失败。
3. 同一 `series` 内 `order` 重复 → 失败。
4. `series` 的值不在 `series.json` 里 → 失败（防止拼写错误分裂成两个系列）。
5. `featured: true` 超过 1 篇 → 失败。
6. `updated` 早于 `date` → 失败。
7. `slug` 或 `tags` 不符合 kebab-case → 失败。
8. 同一 slug 出现在两个目录 → 失败。

规则 3、4、5 需要跨文件检查，放在构建脚本里跑，不放在单文件 schema 里。

## 6. 写作约定

- 正文**不用 `h1`**（标题由 `title` 渲染），标题层级从 `h2` 起，不跳级。
- 代码块必须标语言，否则不高亮也不显示标签。
- 图片必须有 `alt`；纯装饰图写空字符串。
- 外链用完整 `https://`；站内链接用根相对路径（`/posts/xxx`）。
- 中文段落不用斜体（见 design-system §3）。
- 每篇至少一个可被引用的结论句，放在 `summary` 里。

## 7. 写作流程

```bash
pnpm new "在 Tauri 里把状态机拆出来"   # 生成 content/posts/<slug>/index.mdx 骨架
pnpm dev                               # 本地预览，草稿可见
git add . && git commit -m "post: ..." # 提交即发布
```

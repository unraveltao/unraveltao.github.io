# tests/

这个目录目前**只有约定，没有可运行的测试**（`package.json` 里没有 `test` 脚本）。写在这里是为了让"测试该放哪"在写第一个测试之前就有答案，而不是事后各放各的。

## 为什么测试这么少

这个项目是静态站：没有服务端逻辑、没有运行时状态、没有 API。绝大部分正确性由两件事保证：

1. **构建期 schema 校验**（`src/content.config.ts`）——字段错了 build 就失败；
2. **`pnpm build` 本身**——路由、链接、RSS、sitemap 生成失败都会炸。

所以测试的投入应该集中在**构建期校验管不到的地方**，也就是跨文件规则。

## 计划中的分层

```
tests/
├── README.md                    ← 本文件
├── content-validation/          ← 校验规则的单测（最高优先级）
│   ├── valid/                   ← 应当通过的 fixture
│   └── invalid/                 ← 应当失败的 fixture，一个文件一个错误
└── build/                       ← 构建产物冒烟检查（可选）
```

### `content-validation/`

把 `docs/02` §5.5 的规则写成纯函数（`scripts/validate-content.mjs` 导出），逐条断言：

| 规则 | 用例 |
|---|---|
| 同系列 `order` 重复 | 两篇 `order: 1` → 必须失败 |
| `series` 不在 `series.json` | `series: nonexistent` → 必须失败 |
| `featured` 超过 1 篇 | 两篇 `featured: true` → 必须失败 |
| `updated` 早于 `date` | `date: 2026-10-20, updated: 2026-10-01` → 必须失败 |

fixture 放 `invalid/` 下时**一个文件只含一个错误**，这样测试失败时能直接指出是哪条规则退化。

### `build/`

可选。用 `pnpm build` 的产物做冒烟检查：`dist/posts/<slug>/index.html` 存在、`rss.xml` 含全文、`sitemap-index.xml` 条目数对得上。价值不如上面那层，等构建时间变长、需要防止回归时再上。

## 工具选择

**Node 内置 `node:test` + `node:assert`。零依赖。**

理由见 `docs/04` §5：这个项目不引入非必要依赖。校验逻辑是纯函数，不需要 vitest 的 mock / snapshot / 浏览器环境。加一个测试框架等于为了跑 6 个断言引入一棵依赖树。

```bash
node --test tests/          # 现在的实际状态：0 个测试，直接通过
```

## 不测什么

- **视觉**。颜色和间距的正确性靠 `docs/03` 的规格 + 人工在 375px / 1200px 两个断点看一眼，不靠截图比对。
- **Lighthouse 分数**。它是环境相关的连续值，不是断言目标；达标标准写在 `docs/02` §10.1。
- **Astro 框架本身**。构建成功即视为框架工作正常。

## 何时该补测试

出现下面任一情况，就该把对应规则搬进 `tests/`：

- 一条校验规则被"临时放宽"过一次（说明它会再被放宽）；
- 同一个 bug 修了第二次；
- 改动 `src/lib/posts.ts` 的排序 / 过滤逻辑（它没有类型能保证语义正确）。

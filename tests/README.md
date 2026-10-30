# tests/

`pnpm test` 跑这里的 `*.test.mjs`（Node 内置 `node:test`，零依赖）。

## 现在有什么

```
tests/
├── README.md
└── content-rules.test.mjs   ← scripts/lib/content-rules.mjs 的回归，27 个用例
```

覆盖 `docs/02` §5.5 的四条跨文件规则（`order` 重复 / `series` 不存在 / `featured` 超一篇 / `updated < date`），外加 `parseScalarFields` 的九种输入（引号、CRLF、缺块、非法 `order` / 布尔 / 日期）。

用例全部用**内联对象**，不读磁盘：规则是纯函数，读盘是 `scripts/validate-content.mjs` 的事。这也让单个用例能精确构造"只差一个字段"的两篇文章。

## 为什么测试这么少

这个项目是静态站：没有服务端逻辑、没有运行时状态、没有 API。绝大部分正确性由三件事保证：

1. **构建期 schema 校验**（`src/content.config.ts`）——字段错了 build 就失败；
2. **跨文件校验**（`scripts/validate-content.mjs`）——规则 3–6 违反则 build 失败；
3. **`pnpm build` 本身**——路由、链接、RSS、sitemap 生成失败都会炸。

所以测试只投入在**上面三条管不到的地方**：规则函数自身的逻辑。测试对象是"闸门有没有坏"，不是"站点对不对"。

## 一条必须守住的用例

`checkSeriesExists` 曾经用 `key in seriesRegistry` 判断系列是否存在。这走原型链——`series: constructor`、`toString`、`__proto__` 都能**静默通过**校验。现在改成 `Object.hasOwn`，并在测试里锁住了这四个键。

**不要"优化"回 `in`。** 那条用例存在的唯一目的就是拦住这次回退。

## 工具选择

**Node 内置 `node:test` + `node:assert`。零依赖。**

理由见 `docs/04` §5：这个项目不引入非必要依赖。校验逻辑是纯函数，不需要 vitest 的 mock / snapshot / 浏览器环境。加一个测试框架等于为了跑几十个断言引入一棵依赖树。

```bash
pnpm test    # node --test "tests/**/*.test.mjs"
```

glob 必须带引号，交给 Node 自己展开：`node --test tests` 在 Node 22 + Windows 上会把目录当模块入口去 require，报 `MODULE_NOT_FOUND`。

## 不测什么

- **视觉**。颜色和间距的正确性靠 `docs/03` 的规格 + 人工在 375px / 1200px 两个断点看一眼，不靠截图比对。
- **Lighthouse 分数**。它是环境相关的连续值，不是断言目标；达标标准写在 `docs/02` §10.1。
- **Astro 框架本身**。构建成功即视为框架工作正常。
- **构建产物冒烟**（`dist/` 里的文件是否存在）。价值不如规则层，等构建时间变长再说。

## 何时该补测试

出现下面任一情况，就该把对应逻辑搬进来：

- 一条校验规则被"临时放宽"过一次（说明它会再被放宽）；
- 同一个 bug 修了第二次；
- 改动 `src/lib/posts.ts` 的排序 / 过滤逻辑（它没有类型能保证语义正确）——注意它依赖 `astro:content`，需要先把纯逻辑摘出来才可测。

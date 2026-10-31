# 视觉层换成 Digital Garden 的 UI，并引入六套主题

视觉层不再自建，改为整体采用 `Iron-Tom-Digital-Garden` 导出包的设计：衬线大标题、monogram 头图、季节插画、卡片式项目封面、`writing-row` 列表，以及 Spring / Summer / Autumn / Winter / Light / Hacker 六套主题与外观面板。内容模型、路由、发布判定、构建流水线全部不动——**换掉的只是渲染层**。

这条决策直接推翻了 [ADR-0003](./0003-visual-identity.md) 的四条硬约束（零卡片、零阴影、单一强调色、无主题），因此 0003 的状态改为"被 0012 取代"。

**Considered Options**：

- **只借配色，自建布局**：改动最小，但用户要的是"用他的 UI"，只换色等于没换。
- **手写等价 CSS**：可读性最好，但 46KB 样式里有大量坐标与比例（插画的 400×270 视框、歪 5 度的窗口构图），手抄必然走形，且以后无法与参考站对照。
- **逐字 vendor 原站 CSS**（选它）：`app/styles/garden.css` 与 `garden-themes.css` 是原文件换行排版后的副本，选择器与数值一字未改；站点自己的补充只写在 `global.css` 末尾。保真优先，可读性靠注释补。

**Consequences**：

- **设计系统从此有两层**：vendored 的两份 CSS（不要在里面加东西）+ `global.css` 里的本地化与补充。`tokens.css` 删除，色值不再集中在一个文件——AGENTS.md §4.1 第 3 条（字面色值只许出现在 tokens.css）在这个分支上失效。
- **六套主题 = 六倍验收成本**。这正是 0003 拒绝四套预设的理由；这次接受它，因为主题是这个 UI 的主体，不是附加功能。默认 Spring，旧值 `dark` 迁移到 `hacker`。
- **首屏 JS 从 121.8KB 涨到 126.6KB**（gzip，首页 modulepreload 实测）。涨的 4.8KB 来自 ThemeProvider / ThemeMenu / GardenArt / Icon 四个组件。仍在 130KB 预算内，但只剩 3.4KB 余量——下一次加交互要先看这个数。
- **CSS 从 8.6KB 涨到 46.6KB**，全部内联进 HTML，首页 HTML 55.7KB。静态托管 + 内联策略不变，代价是每页多传约 38KB 文本。
- **中文需要二次本地化**：原站是英文站，斜体、字体栈、标题断行都按英文调。已补：中文衬线字体栈、关掉标题与页脚的斜体、窄屏标题 `text-wrap: balance`、单项目时 `auto-fit` 铺满一行。
- **原站的部分毛病一并继承**：Hacker 主题下插画 caption 压在终端最后一行上（已在本站隐藏）；`.workshop-*`、`.tool-panel`、旧 `.swatch` 等一批选择器在这是死代码，没有删，等真正开始改视觉时再清。
- **主题切换依赖 `[data-theme]` 写在 `<html>` 上**，而 hydration 会抹掉内联脚本写的属性。ThemeProvider 必须在 `useLayoutEffect` 里把属性写回去，否则选了 Summer 的用户看到的是 Spring 的配色。

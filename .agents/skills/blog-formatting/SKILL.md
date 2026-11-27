---
name: blog-formatting
description: Apply consistent numbered section headings to Notion and GitHub blog articles without rewriting their content.
---

# Blog Formatting V1.0

适用：Notion Blog Articles 与 GitHub 博客文章的编写、归档、排版和格式迁移。不负责内容改写、发布审批或状态变更。

## 规则
- 页面标题独立于正文；正文主章节使用 H2（Markdown `##`），按出现顺序编号，从 `01 / 标题` 开始，至少两位数字，斜杠两侧各一个空格。
- H3 及更深层级保留原样，不强制编号；不跳级。短文没有章节时，不新增标题。
- 已有章节编号统一替换，不重复加编号。保留原章节名称、顺序及正文。
- 不修改代码围栏内的文本、引用、图片、链接、文章标题、slug、日期、分类、标签、发布状态及其他元数据。
- 若标题变更影响已有锚点链接，先核查并保留链接可用性；无法安全迁移时报告例外，不擅自重写内容。

## 执行
1. 读取正式规范及目标文章，确定真实主章节；仅修改标题行。
2. 每篇独立连续编号；对已符合规范的文章不写入。
3. 对比修改前后，确认除了目标标题（及必要的锚点兼容调整）外没有变化；保留原始 Markdown/Notion 块类型。
4. 写入目标平台后回查，报告修改、跳过和失败数量；不声称未经执行的构建或部署成功。

## 同步
GitHub 本仓库 `.agents/skills/blog-formatting/SKILL.md` 为唯一事实来源；Notion Our Skills 为同版本镜像。变更先更新 GitHub，再同步 Notion，回查版本与规则一致。不同步时明确报告；不假定存在自动同步机制。

示例：`## 背景` → `## 01 / 背景`；`## 2. 实践` → `## 02 / 实践`；`### 示例` 保持原样。

# 部署到 GitHub Pages，仓库名即站点域名

站点发布在 `unraveltao.github.io` 这个用户站点仓库上，由 GitHub Actions 构建后经 `actions/deploy-pages` 发布，不用 Cloudflare Pages。理由是仓库已经在那儿，而用户站点部署在**根路径**——不需要 `base`，代码里所有 `/posts/...` 绝对链接原样有效，省掉一整类子路径 bug。

**Considered Options**：`blog.github` 这类项目站点要加 `base` 前缀并改写所有内部链接，URL 还多一层；Cloudflare Pages 访问更稳，但要额外维护一个平台。

**Consequences**：站点 URL 被仓库名锁死，改仓库名等于改 URL 且没有跳转；GitHub Pages 在国内访问速度不稳定。GitHub Pages 是目录式托管，`/posts/x` 会被 301 到 `/posts/x/`，所以全站改成 `trailingSlash: 'always'`——原先"永不带尾斜杠"的约定在它上面无法成立。将来若绑自定义域名，只需加 CNAME、改 `site` 一处，不影响代码结构。

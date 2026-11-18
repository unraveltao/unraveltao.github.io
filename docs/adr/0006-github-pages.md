# Deploy to GitHub Pages with the Repository Name as the Site Domain

> Updated on 2026-10-31: the hosting target remains GitHub Pages. The old `trailingSlash: 'always'` setting no longer exists after the React Router migration; prerender output, `postbuild.mjs`, and `serve.mjs` now work together to preserve trailing-slash URLs. See [ADR-0011](./0011-vite-react-router.md).

The site is deployed as the GitHub user site `unraveltao.github.io` by GitHub Actions and `actions/deploy-pages`. A user site is hosted at the root path, so the application needs no `base` prefix and root-relative links such as `/posts/...` work directly.

**Considered Options**: A project site such as `blog.github.io` would need a `base` prefix and rewritten internal links. Cloudflare Pages might provide different regional access but would add another platform to maintain.

**Consequences**: The repository name is tied to the public URL; renaming it changes the URL and does not provide redirects. GitHub Pages access may be inconsistent in some regions. The site's public URL policy uses trailing slashes. A future custom domain can be added with a CNAME and a site URL update without changing the application structure.

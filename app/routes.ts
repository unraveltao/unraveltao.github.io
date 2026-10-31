import { type RouteConfig, index, route } from '@react-router/dev/routes'

/**
 * 路由表就是 URL 表。所有对外 URL 都带尾斜杠（ADR-0006 / AGENTS.md §4.2），
 * 这里的路径不带斜杠，是因为构建产物是 X.html，由 postbuild 改写成 X/index.html。
 */
export default [
  index('routes/home.tsx'),
  route('posts', 'routes/posts.tsx'),
  route('posts/:slug', 'routes/post.tsx'),
  route('projects', 'routes/projects.tsx'),
  route('projects/:slug', 'routes/project.tsx'),
  route('tags', 'routes/tags.tsx'),
  route('tags/:tag', 'routes/tag.tsx'),
  route('series/:series', 'routes/series.tsx'),
  route('about', 'routes/about.tsx'),
  route('404', 'routes/not-found.tsx', { id: 'not-found' }),
  route('*', 'routes/not-found.tsx', { id: 'catch-all' }),
] satisfies RouteConfig

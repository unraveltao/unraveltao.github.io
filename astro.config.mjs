import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import rehypeCodeWindow from './src/lib/rehype-code-window.mjs';

export default defineConfig({
  // 用户站点部署在根路径，不需要 base
  site: 'https://unraveltao.github.io',
  output: 'static',
  // GitHub Pages 是目录式托管，无尾斜杠会被 301，所以全站统一带尾斜杠
  trailingSlash: 'always',
  // MDX 不会自动继承 markdown.rehypePlugins，需要显式传一次
  integrations: [mdx({ rehypePlugins: [rehypeCodeWindow] }), sitemap()],
  markdown: {
    shikiConfig: {
      // min-* 是低饱和主题，接近「高亮色从 ink/accent 派生」的设计约束
      themes: { light: 'min-light', dark: 'min-dark' },
    },
    // 代码块套一层 macOS 窗口（三个圆点 + 语言标签）
    rehypePlugins: [rehypeCodeWindow],
  },
});

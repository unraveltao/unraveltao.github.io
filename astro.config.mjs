import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // 用户站点部署在根路径，不需要 base
  site: 'https://unraveltao.github.io',
  output: 'static',
  trailingSlash: 'never',
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      // min-* 是低饱和主题，接近「高亮色从 ink/accent 派生」的设计约束
      themes: { light: 'min-light', dark: 'min-dark' },
    },
  },
});

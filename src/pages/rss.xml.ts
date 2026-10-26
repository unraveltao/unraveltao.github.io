import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { render } from 'astro:content';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import mdxRenderer from '@astrojs/mdx/server.js';
import { getPublishedPosts } from '../lib/posts';
import { SITE_NAME, SITE_DESCRIPTION } from '../lib/site';

export async function GET(context: APIContext) {
  const posts = (await getPublishedPosts()).slice(0, 20);

  // 用容器 API 把 MDX 渲染成 HTML，否则订阅者在阅读器里看到的是 markdown 源码。
  // mdx 的 server 入口导出的已经是「加载好的 renderer」，不需要再过 loadRenderers。
  const container = await AstroContainer.create({
    renderers: [{ name: 'astro:jsx', ssr: mdxRenderer as never }],
  });

  const items = [];
  for (const post of posts) {
    const { Content } = await render(post);
    const html = await container.renderToString(Content);

    items.push({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.summary,
      link: `/posts/${post.id}/`,
      content: html,
    });
  }

  return rss({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    site: context.site!,
    items,
    customData: '<language>zh-CN</language>',
  });
}

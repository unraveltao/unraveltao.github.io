import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedPosts } from '../lib/posts';
import { SITE_NAME, SITE_DESCRIPTION } from '../lib/site';

export async function GET(context: APIContext) {
  const posts = (await getPublishedPosts()).slice(0, 20);

  return rss({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.summary,
      link: `/posts/${post.id}`,
      // TODO(M1): 用容器 API 渲染成 HTML，目前输出的是 MDX 原文（已去掉 import 行）
      content: (post.body ?? '').replace(/^import .*$/gm, ''),
    })),
    customData: '<language>zh-CN</language>',
  });
}

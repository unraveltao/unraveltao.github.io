import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/** 已发布 = 非草稿 且 日期已到 */
export function isPublished(post: Post, now = new Date()) {
  return !post.data.draft && post.data.date <= now;
}

export async function getPublishedPosts(now = new Date()): Promise<Post[]> {
  const posts = await getCollection('posts', (p) => isPublished(p, now));
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function groupByYear(posts: Post[]): [number, Post[]][] {
  const map = new Map<number, Post[]>();
  for (const post of posts) {
    const year = post.data.date.getUTCFullYear();
    if (!map.has(year)) map.set(year, []);
    map.get(year)!.push(post);
  }
  return [...map.entries()].sort((a, b) => b[0] - a[0]);
}

export function collectTags(posts: Post[]): [string, number][] {
  const map = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) map.set(tag, (map.get(tag) ?? 0) + 1);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

#!/usr/bin/env node
/**
 * 构建期跨文件校验。
 *
 * 单文件字段约束在 src/content.config.ts 的 zod schema 里；这里只做 schema
 * 表达不了的四条（docs/02 §5.5 规则 3/4/5/6）：
 *   3. 同一 series 内 order 重复
 *   4. series 不在 content/series.json
 *   5. featured 超过 1 篇
 *   6. updated 早于 date
 *
 * 不引入 YAML 解析依赖：只读这几个标量字段，读不懂就报错，绝不静默放过。
 */
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const POSTS_DIR = join(ROOT, 'content', 'posts');
const SERIES_FILE = join(ROOT, 'content', 'series.json');

const FIELDS = new Set(['series', 'order', 'featured', 'date', 'updated', 'draft']);

class FieldError extends Error {}

/** 只解析 FIELDS 里的标量字段，其余一律忽略（数组、多行字符串不在此列） */
function readFrontmatter(raw, file) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new FieldError('缺少 frontmatter 块');

  const values = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w-]*):[ \t]*(.*)$/);
    if (!kv) continue;
    const [, key, rest] = kv;
    if (!FIELDS.has(key)) continue;
    values[key] = rest.trim();
  }

  const out = {};

  if ('series' in values) {
    out.series = unquote(values.series);
    if (!out.series) throw new FieldError('series 为空');
  }

  if ('order' in values) {
    const n = Number(unquote(values.order));
    if (!Number.isInteger(n) || n < 1) {
      throw new FieldError(`order 不是正整数：${values.order}`);
    }
    out.order = n;
  }

  for (const key of ['featured', 'draft']) {
    if (!(key in values)) continue;
    const v = unquote(values[key]);
    if (v !== 'true' && v !== 'false') {
      throw new FieldError(`${key} 必须是 true 或 false：${values[key]}`);
    }
    out[key] = v === 'true';
  }

  for (const key of ['date', 'updated']) {
    if (!(key in values)) continue;
    const v = unquote(values[key]);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) {
      throw new FieldError(`${key} 必须是 YYYY-MM-DD：${values[key]}`);
    }
    out[key] = v;
  }

  return out;
}

function unquote(value) {
  const v = value.trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1);
  }
  return v;
}

async function loadPosts() {
  const dirs = await readdir(POSTS_DIR, { withFileTypes: true });
  const posts = [];

  for (const dir of dirs) {
    if (!dir.isDirectory()) continue;
    const file = join(POSTS_DIR, dir.name, 'index.mdx');
    let raw;
    try {
      raw = await readFile(file, 'utf8');
    } catch {
      continue;
    }
    const rel = `content/posts/${dir.name}/index.mdx`;
    try {
      posts.push({ slug: dir.name, file: rel, data: readFrontmatter(raw, rel) });
    } catch (err) {
      if (err instanceof FieldError) throw new Error(`${rel}\n  ${err.message}`);
      throw err;
    }
  }

  return posts;
}

async function main() {
  const seriesRegistry = JSON.parse(await readFile(SERIES_FILE, 'utf8'));
  const posts = await loadPosts();
  const errors = [];

  // 规则 4：series 必须存在于 series.json
  for (const post of posts) {
    const key = post.data.series;
    if (key && !(key in seriesRegistry)) {
      const known = Object.keys(seriesRegistry).join(', ') || '（空）';
      errors.push(`${post.file}\n  series: "${key}" 不在 content/series.json，现有：${known}`);
    }
  }

  // 规则 3：同一 series 内 order 不能重复
  const bySeries = new Map();
  for (const post of posts) {
    const key = post.data.series;
    if (!key || post.data.order === undefined) continue;
    if (!bySeries.has(key)) bySeries.set(key, new Map());
    const orders = bySeries.get(key);
    const taken = orders.get(post.data.order);
    if (taken) {
      errors.push(
        `${post.file}\n  order: ${post.data.order} 与 ${taken.file} 在系列 "${key}" 内重复`,
      );
    } else {
      orders.set(post.data.order, post);
    }
  }

  // 规则 5：featured 最多 1 篇（只算会真正发布的，draft 不上首页）
  const featured = posts.filter((p) => p.data.featured && !p.data.draft);
  if (featured.length > 1) {
    errors.push(
      `${featured.map((p) => p.file).join('\n')}\n  featured: true 有 ${featured.length} 篇，最多 1 篇`,
    );
  }

  // 规则 6：updated 不能早于 date
  for (const post of posts) {
    const { date, updated } = post.data;
    if (date && updated && updated < date) {
      errors.push(`${post.file}\n  updated (${updated}) 早于 date (${date})`);
    }
  }

  if (errors.length > 0) {
    console.error(`\n内容校验失败（${errors.length} 处）：\n`);
    for (const err of errors) console.error(`✗ ${err}\n`);
    console.error('规则见 docs/02-Product-Requirements.md §5.5\n');
    process.exit(1);
  }

  const seriesCount = new Set(posts.map((p) => p.data.series).filter(Boolean)).size;
  console.log(`✓ 内容校验通过：${posts.length} 篇，${seriesCount} 个系列，${featured.length} 篇精选`);
}

main().catch((err) => {
  console.error(`\n✗ 内容校验无法完成：\n${err.message}\n`);
  process.exit(1);
});

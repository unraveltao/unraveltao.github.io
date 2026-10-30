#!/usr/bin/env node
/**
 * 构建期跨文件校验的 CLI 外壳。
 *
 * 规则本身在 scripts/lib/content-rules.mjs（纯函数、有回归测试）；这里只负责
 * 读盘、调规则、把结果打印成人能直接照着改的样子。规则见 docs/02 §5.5 规则 3–6。
 */
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { FieldError, parseScalarFields, checkAll } from './lib/content-rules.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const POSTS_DIR = join(ROOT, 'content', 'posts');
const SERIES_FILE = join(ROOT, 'content', 'series.json');

/** 读全部文章；读不懂的文件单独收集，不因为一篇坏文件就中断扫描 */
async function loadPosts() {
  const dirs = await readdir(POSTS_DIR, { withFileTypes: true });
  const posts = [];
  const parseErrors = [];

  for (const dir of dirs) {
    if (!dir.isDirectory()) continue;
    const file = join(POSTS_DIR, dir.name, 'index.mdx');
    let raw;
    try {
      raw = await readFile(file, 'utf8');
    } catch {
      continue; // 没有 index.mdx 的目录不是文章
    }

    const rel = `content/posts/${dir.name}/index.mdx`;
    try {
      posts.push({ slug: dir.name, file: rel, data: parseScalarFields(raw) });
    } catch (err) {
      if (!(err instanceof FieldError)) throw err;
      parseErrors.push({ files: [rel], message: err.message });
    }
  }

  return { posts, parseErrors };
}

function report(header, entries) {
  console.error(`\n${header}\n`);
  for (const { files, message } of entries) {
    console.error(`✗ ${files.join('\n  ')}\n  ${message}\n`);
  }
}

async function main() {
  const seriesRegistry = JSON.parse(await readFile(SERIES_FILE, 'utf8'));
  const { posts, parseErrors } = await loadPosts();

  // frontmatter 读不懂 = 文件坏了，规则无从判断，直接停在这里
  if (parseErrors.length > 0) {
    report(`frontmatter 解析失败（${parseErrors.length} 个文件）：`, parseErrors);
    process.exit(1);
  }

  const problems = checkAll(posts, seriesRegistry);

  if (problems.length > 0) {
    report(`内容校验失败（${problems.length} 处）：`, problems);
    console.error('规则见 docs/02-Product-Requirements.md §5.5\n');
    process.exit(1);
  }

  const seriesCount = new Set(posts.map((p) => p.data.series).filter(Boolean)).size;
  const featuredCount = posts.filter((p) => p.data.featured && !p.data.draft).length;
  console.log(
    `✓ 内容校验通过：${posts.length} 篇，${seriesCount} 个系列，${featuredCount} 篇精选`,
  );
}

main().catch((err) => {
  console.error(`\n✗ 内容校验无法完成：\n${err.message}\n`);
  process.exit(1);
});

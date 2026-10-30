/**
 * scripts/lib/content-rules.mjs 的回归测试。
 *
 * 用内置 node:test，零依赖（AGENTS.md §4.4：加依赖要过三问）。
 * 用例全部用内联对象，不读磁盘——规则是纯函数，读盘是 CLI 的事。
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  FieldError,
  checkAll,
  checkDuplicateOrder,
  checkFeaturedCount,
  checkSeriesExists,
  checkUpdatedNotBeforeDate,
  parseScalarFields,
} from '../scripts/lib/content-rules.mjs';

const post = (slug, data) => ({
  slug,
  file: `content/posts/${slug}/index.mdx`,
  data,
});

const md = (frontmatter, body = '# 标题\n') => `---\n${frontmatter}\n---\n\n${body}`;

describe('parseScalarFields', () => {
  it('解析六个标量字段', () => {
    const out = parseScalarFields(
      md(
        [
          'series: lattice-teardown',
          'order: 2',
          'featured: true',
          'draft: false',
          'date: 2026-03-01',
          'updated: 2026-03-09',
        ].join('\n'),
      ),
    );

    assert.deepEqual(out, {
      series: 'lattice-teardown',
      order: 2,
      featured: true,
      draft: false,
      date: '2026-03-01',
      updated: '2026-03-09',
    });
  });

  it('忽略不在白名单里的字段，包括数组与多行值', () => {
    const out = parseScalarFields(
      md(
        [
          'title: 一篇有标题的文章',
          'tags: [astro, css]',
          'series: s1',
          'order: 1',
          'date: 2026-03-01',
        ].join('\n'),
      ),
    );

    assert.deepEqual(Object.keys(out).sort(), ['date', 'order', 'series']);
  });

  it('去掉值两侧的引号', () => {
    const out = parseScalarFields(md(`series: "s1"\norder: 1`));
    assert.equal(out.series, 's1');
  });

  it('容忍 CRLF 换行', () => {
    const out = parseScalarFields('---\r\nseries: s1\r\norder: 1\r\n---\r\n\r\n正文\r\n');
    assert.equal(out.series, 's1');
    assert.equal(out.order, 1);
  });

  it('缺少 frontmatter 块时抛 FieldError', () => {
    assert.throws(() => parseScalarFields('# 直接就是正文\n'), FieldError);
  });

  it('order 不是正整数时抛 FieldError', () => {
    assert.throws(() => parseScalarFields(md('order: 0')), FieldError);
    assert.throws(() => parseScalarFields(md('order: 1.5')), FieldError);
    assert.throws(() => parseScalarFields(md('order: abc')), FieldError);
  });

  it('布尔字段不是 true/false 时抛 FieldError', () => {
    assert.throws(() => parseScalarFields(md('featured: yes')), FieldError);
    assert.throws(() => parseScalarFields(md('draft: 1')), FieldError);
  });

  it('日期不是 YYYY-MM-DD 时抛 FieldError', () => {
    assert.throws(() => parseScalarFields(md('date: 2026/03/01')), FieldError);
    assert.throws(() => parseScalarFields(md('updated: 2026-3-1')), FieldError);
  });

  it('series 为空串时抛 FieldError', () => {
    assert.throws(() => parseScalarFields(md('series: ""')), FieldError);
  });
});

describe('checkSeriesExists（规则 4）', () => {
  const registry = { 'lattice-teardown': { name: 'lattice 拆解' } };

  it('series 存在于 registry 时不报错', () => {
    const posts = [post('a', { series: 'lattice-teardown', order: 1 })];
    assert.deepEqual(checkSeriesExists(posts, registry), []);
  });

  it('series 不存在时报错并列出已知系列', () => {
    const posts = [post('a', { series: 'typo-series', order: 1 })];
    const [problem] = checkSeriesExists(posts, registry);

    assert.equal(problem.rule, 'series-unknown');
    assert.deepEqual(problem.files, ['content/posts/a/index.mdx']);
    assert.match(problem.message, /typo-series/);
    assert.match(problem.message, /lattice-teardown/);
  });

  it('没有 series 的文章直接跳过', () => {
    assert.deepEqual(checkSeriesExists([post('a', {})], registry), []);
  });

  it('registry 为空时任何 series 都报错', () => {
    const posts = [post('a', { series: 'anything', order: 1 })];
    assert.equal(checkSeriesExists(posts, {}).length, 1);
  });

  // 回归：曾经用 `key in registry`，走原型链导致这些键静默通过校验
  it('原型链上的键不算已存在的 series', () => {
    for (const key of ['constructor', 'toString', 'hasOwnProperty', '__proto__']) {
      const posts = [post('a', { series: key, order: 1 })];
      const problems = checkSeriesExists(posts, registry);
      assert.equal(problems.length, 1, `series: ${key} 应当被拒绝`);
    }
  });
});

describe('checkDuplicateOrder（规则 3）', () => {
  it('同一 series 内 order 重复时报错', () => {
    const posts = [
      post('a', { series: 's1', order: 1 }),
      post('b', { series: 's1', order: 1 }),
    ];
    const [problem] = checkDuplicateOrder(posts);

    assert.equal(problem.rule, 'order-duplicate');
    assert.deepEqual(problem.files, ['content/posts/b/index.mdx']);
    assert.match(problem.message, /content\/posts\/a\/index\.mdx/);
  });

  it('跨 series 用同一个 order 不冲突', () => {
    const posts = [
      post('a', { series: 's1', order: 1 }),
      post('b', { series: 's2', order: 1 }),
    ];
    assert.deepEqual(checkDuplicateOrder(posts), []);
  });

  it('没有 order 或没有 series 的跳过', () => {
    const posts = [
      post('a', { series: 's1' }),
      post('b', { order: 1 }),
      post('c', { series: 's1', order: 1 }),
      post('d', { series: 's1', order: 1 }),
    ];
    assert.equal(checkDuplicateOrder(posts).length, 1);
  });

  it('三篇同 order 报两次', () => {
    const posts = [
      post('a', { series: 's1', order: 1 }),
      post('b', { series: 's1', order: 1 }),
      post('c', { series: 's1', order: 1 }),
    ];
    assert.equal(checkDuplicateOrder(posts).length, 2);
  });
});

describe('checkFeaturedCount（规则 5）', () => {
  it('0 篇和 1 篇都不报错', () => {
    assert.deepEqual(checkFeaturedCount([]), []);
    assert.deepEqual(checkFeaturedCount([post('a', { featured: true })]), []);
  });

  it('2 篇报错，并列出全部文件', () => {
    const posts = [
      post('a', { featured: true }),
      post('b', { featured: true }),
    ];
    const [problem] = checkFeaturedCount(posts);

    assert.equal(problem.rule, 'featured-too-many');
    assert.equal(problem.files.length, 2);
    assert.match(problem.message, /2 篇/);
  });

  it('草稿不计入（草稿不上首页）', () => {
    const posts = [
      post('a', { featured: true }),
      post('b', { featured: true, draft: true }),
    ];
    assert.deepEqual(checkFeaturedCount(posts), []);
  });
});

describe('checkUpdatedNotBeforeDate（规则 6）', () => {
  it('updated 早于 date 时报错', () => {
    const posts = [post('a', { date: '2026-03-10', updated: '2026-03-01' })];
    const [problem] = checkUpdatedNotBeforeDate(posts);

    assert.equal(problem.rule, 'updated-before-date');
    assert.deepEqual(problem.files, ['content/posts/a/index.mdx']);
  });

  it('updated 等于 date 时通过', () => {
    const posts = [post('a', { date: '2026-03-10', updated: '2026-03-10' })];
    assert.deepEqual(checkUpdatedNotBeforeDate(posts), []);
  });

  it('只填 date 或只填 updated 都跳过', () => {
    assert.deepEqual(checkUpdatedNotBeforeDate([post('a', { date: '2026-03-10' })]), []);
    assert.deepEqual(checkUpdatedNotBeforeDate([post('a', { updated: '2026-03-10' })]), []);
  });

  it('跨年比较正确', () => {
    const posts = [post('a', { date: '2026-01-01', updated: '2025-12-31' })];
    assert.equal(checkUpdatedNotBeforeDate(posts).length, 1);
  });
});

describe('checkAll', () => {
  it('多条违规一次全报，顺序稳定', () => {
    const registry = { s1: {} };
    const posts = [
      post('a', { series: 'nope', order: 1 }),
      post('b', { series: 's1', order: 2, featured: true }),
      post('c', { series: 's1', order: 2, featured: true }),
      post('d', { series: 's1', order: 3, date: '2026-05-01', updated: '2026-04-01' }),
    ];

    const problems = checkAll(posts, registry);
    assert.deepEqual(
      problems.map((p) => p.rule),
      ['series-unknown', 'order-duplicate', 'featured-too-many', 'updated-before-date'],
    );
  });

  it('干净的仓库返回空数组', () => {
    const registry = { s1: {} };
    const posts = [
      post('a', { series: 's1', order: 1, featured: true, date: '2026-03-01' }),
      post('b', { series: 's1', order: 2, date: '2026-03-02', updated: '2026-03-05' }),
    ];
    assert.deepEqual(checkAll(posts, registry), []);
  });
});

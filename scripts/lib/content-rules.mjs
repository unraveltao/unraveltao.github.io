/**
 * 跨文件内容校验规则——纯函数，不碰文件系统。
 *
 * 单文件字段约束在 velite.config.ts 的 zod schema 里；这里只做 schema
 * 表达不了的四条（docs/02 §5.5 规则 3/4/5/6）：
 *   3. 同一 series 内 order 重复
 *   4. series 不在 content/series.json
 *   5. featured 超过 1 篇
 *   6. updated 早于 date
 *
 * 规则一律**返回** Problem[]，不抛异常：这样一次能报出全部违规，而不是改一处
 * 跑一次。只有"根本读不懂 frontmatter"才抛 FieldError——那不是违规，是文件坏了。
 *
 * 不引入 YAML 解析依赖：只读六个标量字段，读不懂就报错，绝不静默放过。
 */

/** @typedef {{ slug: string, file: string, data: object }} Post */
/** @typedef {{ rule: string, files: string[], message: string }} Problem */

const FIELDS = new Set(['series', 'order', 'featured', 'date', 'updated', 'draft']);

/** frontmatter 结构性问题：缺块、类型不对、格式不对 */
export class FieldError extends Error {}

function unquote(value) {
  const v = value.trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1);
  }
  return v;
}

/**
 * 只解析 FIELDS 里的标量字段，其余一律忽略（数组、多行字符串不在此列）。
 * @param {string} raw 文件全文
 * @returns {{ series?: string, order?: number, featured?: boolean, draft?: boolean, date?: string, updated?: string }}
 */
export function parseScalarFields(raw) {
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

  if (Object.hasOwn(values, 'series')) {
    out.series = unquote(values.series);
    if (!out.series) throw new FieldError('series 为空');
  }

  if (Object.hasOwn(values, 'order')) {
    const n = Number(unquote(values.order));
    if (!Number.isInteger(n) || n < 1) {
      throw new FieldError(`order 不是正整数：${values.order}`);
    }
    out.order = n;
  }

  for (const key of ['featured', 'draft']) {
    if (!Object.hasOwn(values, key)) continue;
    const v = unquote(values[key]);
    if (v !== 'true' && v !== 'false') {
      throw new FieldError(`${key} 必须是 true 或 false：${values[key]}`);
    }
    out[key] = v === 'true';
  }

  for (const key of ['date', 'updated']) {
    if (!Object.hasOwn(values, key)) continue;
    const v = unquote(values[key]);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) {
      throw new FieldError(`${key} 必须是 YYYY-MM-DD：${values[key]}`);
    }
    out[key] = v;
  }

  return out;
}

/**
 * 规则 4：series 必须存在于 series.json。
 *
 * 必须用 Object.hasOwn 而不是 `in`：`"constructor" in {}` 为 true，
 * 走原型链会让 `series: constructor` 静默通过校验。
 * @param {Post[]} posts
 * @param {Record<string, unknown>} registry
 * @returns {Problem[]}
 */
export function checkSeriesExists(posts, registry) {
  const problems = [];
  const known = Object.keys(registry).join(', ') || '（空）';

  for (const post of posts) {
    const key = post.data.series;
    if (!key) continue;
    if (!Object.hasOwn(registry, key)) {
      problems.push({
        rule: 'series-unknown',
        files: [post.file],
        message: `series: "${key}" 不在 content/series.json，现有：${known}`,
      });
    }
  }

  return problems;
}

/**
 * 规则 3：同一 series 内 order 不能重复。跨 series 同 order 不冲突。
 * @param {Post[]} posts
 * @returns {Problem[]}
 */
export function checkDuplicateOrder(posts) {
  const problems = [];
  /** @type {Map<string, Map<number, Post>>} */
  const bySeries = new Map();

  for (const post of posts) {
    const key = post.data.series;
    if (!key || post.data.order === undefined) continue;
    if (!bySeries.has(key)) bySeries.set(key, new Map());
    const orders = bySeries.get(key);
    const taken = orders.get(post.data.order);
    if (taken) {
      problems.push({
        rule: 'order-duplicate',
        files: [post.file],
        message: `order: ${post.data.order} 与 ${taken.file} 在系列 "${key}" 内重复`,
      });
    } else {
      orders.set(post.data.order, post);
    }
  }

  return problems;
}

/**
 * 规则 5：featured 最多 1 篇。只算会真正发布的（draft 不上首页）。
 * @param {Post[]} posts
 * @returns {Problem[]}
 */
export function checkFeaturedCount(posts) {
  const featured = posts.filter((p) => p.data.featured && !p.data.draft);
  if (featured.length <= 1) return [];
  return [
    {
      rule: 'featured-too-many',
      files: featured.map((p) => p.file),
      message: `featured: true 有 ${featured.length} 篇，最多 1 篇`,
    },
  ];
}

/**
 * 规则 6：updated 不能早于 date。两者都是 YYYY-MM-DD，可直接字符串比较。
 * @param {Post[]} posts
 * @returns {Problem[]}
 */
export function checkUpdatedNotBeforeDate(posts) {
  const problems = [];
  for (const post of posts) {
    const { date, updated } = post.data;
    if (date && updated && updated < date) {
      problems.push({
        rule: 'updated-before-date',
        files: [post.file],
        message: `updated (${updated}) 早于 date (${date})`,
      });
    }
  }
  return problems;
}

/**
 * 跑全部四条规则，按固定顺序返回（输出稳定，测试好写）。
 * @param {Post[]} posts
 * @param {Record<string, unknown>} registry
 * @returns {Problem[]}
 */
export function checkAll(posts, registry) {
  return [
    ...checkSeriesExists(posts, registry),
    ...checkDuplicateOrder(posts),
    ...checkFeaturedCount(posts),
    ...checkUpdatedNotBeforeDate(posts),
  ];
}

/** 中文按 400 字/分，拉丁文按 200 词/分，最少 1 分钟 */
export function readingTime(markdown: string): number {
  const cjk = (markdown.match(/[\u4e00-\u9fa5]/g) ?? []).length;
  const words = (markdown.replace(/[\u4e00-\u9fa5]/g, ' ').match(/[A-Za-z0-9]+/g) ?? []).length;
  return Math.max(1, Math.ceil(cjk / 400 + words / 200));
}

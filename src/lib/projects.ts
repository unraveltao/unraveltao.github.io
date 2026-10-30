import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

const STATUS_LABEL: Record<Project['data']['status'], string> = {
  active: '进行中',
  done: '已完成',
  archived: '已归档',
};

/** 状态文案只在这里定义，页面里不要各写一份 */
export function statusLabel(status: Project['data']['status']): string {
  return STATUS_LABEL[status];
}

/**
 * 全部已发布项目，按 order 升序；没有 order 的排在后面，再按 name 排。
 * 与 posts.ts 一致：draft 不进构建产物。
 */
export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection('projects', (p) => !p.data.draft);
  return projects.sort((a, b) => {
    const ao = a.data.order ?? Number.MAX_SAFE_INTEGER;
    const bo = b.data.order ?? Number.MAX_SAFE_INTEGER;
    if (ao !== bo) return ao - bo;
    return a.data.name.localeCompare(b.data.name, 'zh-CN');
  });
}

import type { Project } from './content'

const STATUS_LABEL: Record<Project['status'], string> = {
  active: 'In development',
  done: 'Shipped',
  archived: 'Archived',
}

/** 状态文案只在这里定义，页面里不要各写一份 */
export function statusLabel(status: Project['status']): string {
  return STATUS_LABEL[status]
}

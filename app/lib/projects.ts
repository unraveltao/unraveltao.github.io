import type { Project } from './content'

const STATUS_LABEL: Record<Project['status'], string> = {
  active: '进行中',
  done: '已完成',
  archived: '已归档',
}

/** 状态文案只在这里定义，页面里不要各写一份 */
export function statusLabel(status: Project['status']): string {
  return STATUS_LABEL[status]
}

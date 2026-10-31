/**
 * 六套主题：与 app/styles/garden-themes.css 里的 [data-theme=…] 一一对应。
 * 唯一真源是这个数组——外观面板、内联脚本、resolveTheme 都从它派生。
 */

export type ThemeId = 'spring' | 'summer' | 'autumn' | 'winter' | 'light' | 'hacker'

export type ThemeConfig = {
  id: ThemeId
  name: string
  description: string
  /** 对应 <symbol id="i-…"> 的名字，见 components/Icon.tsx */
  icon: 'sprout' | 'wave' | 'maple' | 'snow' | 'sun' | 'terminal'
}

export const THEMES: readonly ThemeConfig[] = [
  { id: 'spring', name: 'Spring', description: '新绿与生长', icon: 'sprout' },
  { id: 'summer', name: 'Summer', description: '海与沙', icon: 'wave' },
  { id: 'autumn', name: 'Autumn', description: '暖色与落叶', icon: 'maple' },
  { id: 'winter', name: 'Winter', description: '清冷与留白', icon: 'snow' },
  { id: 'light', name: 'Light', description: '纯白与克制', icon: 'sun' },
  { id: 'hacker', name: 'Hacker', description: '深色终端', icon: 'terminal' },
]

export const DEFAULT_THEME: ThemeId = 'spring'

const STORAGE_KEY = 'theme'

/** 旧值迁移：上一版只有 light / dark，dark 对应现在的 hacker */
const LEGACY: Record<string, ThemeId> = {
  light: 'light',
  dark: 'hacker',
  paper: 'spring',
  forest: 'spring',
  ink: 'hacker',
}

function isThemeId(value: string | null | undefined): value is ThemeId {
  return THEMES.some((theme) => theme.id === value)
}

/**
 * <head> 里的内联脚本源码。必须同步执行、且在 hydration 之前跑完，
 * 否则浏览器会先画一帧 Spring 再切到用户选的主题——也就是闪一下。
 * 逻辑与 resolveTheme() 保持一致，改一处就要改另一处。
 */
export const THEME_INIT = `try{var m={light:'light',dark:'hacker',paper:'spring',forest:'spring',ink:'hacker'},s=localStorage.getItem('theme'),t=m[s]||s,ok=['spring','summer','autumn','winter','light','hacker'];document.documentElement.dataset.theme=ok.indexOf(t)>-1?t:'spring'}catch(e){document.documentElement.dataset.theme='spring'}`

/**
 * 当前该用哪套主题。
 * React 在 hydration 时会抹掉 <html> 上它不认识的属性（就是内联脚本写进去的
 * data-theme），所以这里不能只看 dataset，还要能自己重算一遍。
 */
export function resolveTheme(): ThemeId {
  const current = document.documentElement.dataset.theme
  if (isThemeId(current)) return current

  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    const migrated = saved ? (LEGACY[saved] ?? saved) : null
    if (isThemeId(migrated)) return migrated
  } catch {
    // 隐私模式下读不到，用默认值
  }

  return DEFAULT_THEME
}

/** 返回是否成功持久化——存不下不影响本次生效，面板上会显示「本次有效」 */
export function applyTheme(theme: ThemeId): boolean {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem(STORAGE_KEY, theme)
    return true
  } catch {
    return false
  }
}

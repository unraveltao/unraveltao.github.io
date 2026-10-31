export type Theme = 'light' | 'dark'

/**
 * <head> 里的内联脚本源码。必须同步执行、且在 hydration 之前跑完，
 * 否则浏览器会先画一帧浅色再切深色——也就是闪白。
 * 逻辑与 resolveTheme() 保持一致，改一处就要改另一处。
 */
export const THEME_INIT = `try{var s=localStorage.getItem('theme');document.documentElement.dataset.theme=(s==='dark'||s==='light')?s:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch(e){document.documentElement.dataset.theme='light'}`

/**
 * 当前该用哪套主题。
 * React 在 hydration 时会抹掉 <html> 上它不认识的属性（就是内联脚本写进去的
 * data-theme），所以这里不能只看 dataset，还要能自己重算一遍。
 */
export function resolveTheme(): Theme {
  const current = document.documentElement.dataset.theme
  if (current === 'dark' || current === 'light') return current

  try {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || saved === 'light') return saved
  } catch {
    // 隐私模式下读不到，按系统偏好走
  }

  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem('theme', theme)
  } catch {
    // 存不下不影响本次生效
  }
}

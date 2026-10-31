import { useEffect, useState } from 'react'
import { applyTheme, resolveTheme, type Theme } from '~/lib/theme'
import styles from './ThemeToggle.module.css'

export function ThemeToggle() {
  // 首屏主题由 <head> 里的内联脚本决定，这里只接管后续交互。
  // 不能在渲染期读 document，否则预渲染产物与 hydration 结果对不上。
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    setTheme(resolveTheme())
  }, [])

  const toggle = () => {
    const next: Theme = resolveTheme() === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    setTheme(next)
  }

  // 可访问名必须包含可见文字（WCAG 2.5.3 Label in Name），
  // 否则读屏用户说的「dark」在无障碍名里找不到。
  return (
    <button
      className={styles.theme}
      type="button"
      aria-label={theme === 'dark' ? 'dark 主题，切换到浅色' : 'light 主题，切换到深色'}
      onClick={toggle}
    >
      <span>{theme}</span>
    </button>
  )
}

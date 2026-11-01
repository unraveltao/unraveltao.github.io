import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import { applyTheme, resolveTheme, type ThemeId } from '~/lib/theme'

type ThemeContextValue = {
  theme: ThemeId
  setTheme: (theme: ThemeId) => boolean
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'spring',
  setTheme: () => false,
})

/**
 * 主题状态放在这里，而不是每个组件自己读 document。
 *
 * 首屏渲染必须是 'spring'，服务端和客户端才对得上（预渲染的 HTML 里就是 Spring 的插画）。
 * 真实主题在 useLayoutEffect 里同步——浏览器下一次绘制之前，用户看不到 Spring 闪一下。
 *
 * 不能用 useState(() => resolveTheme())：那会在 hydration 时读到 localStorage，
 * 客户端首帧和预渲染的 HTML 不一致，React 会报 hydration mismatch 并重画整棵子树。
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>('spring')

  useLayoutEffect(() => {
    // 只 setState 不够：hydration 会抹掉 <html> 上内联脚本写的 data-theme，
    // 而 CSS 是按 [data-theme=…] 选主题的。属性必须补回去。
    const current = resolveTheme()
    document.documentElement.dataset.theme = current
    setThemeState(current)
  }, [])

  const setTheme = useCallback((next: ThemeId) => {
    const saved = applyTheme(next)
    setThemeState(next)
    return saved
  }, [])

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}

import { useEffect, useRef, useState } from 'react'
import { THEMES, type ThemeConfig } from '~/lib/theme'
import { Icon } from './Icon'
import { useTheme } from './ThemeProvider'

/**
 * 外观面板：六套主题，选完不关，方便当场比较（原站的行为，保留）。
 * 键盘：方向键在 2 列网格里移动，Home/End 到首尾，Esc 关闭并归还焦点。
 */

function ThemeOption({ config, active, onPick }: { config: ThemeConfig; active: boolean; onPick: () => void }) {
  return (
    <button
      type="button"
      className="theme-option"
      data-theme-choice={config.id}
      aria-pressed={active}
      aria-label={config.name}
      onClick={onPick}
    >
      <span className={`theme-preview preview-${config.id}`} aria-hidden="true">
        <span className="preview-dots">···</span>
        <span className="preview-type">{config.terminal ? '>_' : 'Aa'}</span>
        <Icon name={config.icon} />
        <span className="theme-check">
          <Icon name="check" />
        </span>
      </span>
      <span className="theme-option-name">{config.name}</span>
      <span className="theme-option-description">{config.description}</span>
    </button>
  )
}

export function ThemeMenu() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [saved, setSaved] = useState(true)
  const wrapRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLElement>(null)

  const current = THEMES.find((item) => item.id === theme) ?? THEMES[0]!

  const close = (restoreFocus = false) => {
    setOpen(false)
    if (restoreFocus) triggerRef.current?.focus()
  }

  const pick = (id: ThemeConfig['id']) => {
    setSaved(setTheme(id))
  }

  useEffect(() => {
    if (!open) return

    // 打开时把焦点放到当前选中的那一项，读屏用户能立刻知道自己在哪
    panelRef.current?.querySelector<HTMLButtonElement>('[aria-pressed="true"]')?.focus()

    const onPointerDown = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close(true)
        return
      }

      const buttons = [...(panelRef.current?.querySelectorAll<HTMLButtonElement>('[data-theme-choice]') ?? [])]
      const index = buttons.indexOf(document.activeElement as HTMLButtonElement)
      if (index < 0) return

      const steps: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 2, ArrowUp: -2 }
      let next: number | undefined
      if (event.key in steps) next = (index + steps[event.key]! + buttons.length) % buttons.length
      else if (event.key === 'Home') next = 0
      else if (event.key === 'End') next = buttons.length - 1
      if (next === undefined) return

      event.preventDefault()
      buttons[next]?.focus()
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div className="theme-wrap" ref={wrapRef}>
      <button
        type="button"
        className="theme-trigger"
        ref={triggerRef}
        aria-expanded={open}
        aria-controls="theme-menu"
        aria-label={`外观设置，当前主题 ${current.name}`}
        onClick={() => setOpen((value) => !value)}
      >
        <Icon name="settings" />
        <span>{current.name}</span>
        <Icon name="chevron" className="theme-chevron" />
      </button>

      <section
        className="theme-menu appearance-panel"
        id="theme-menu"
        aria-label="外观设置"
        hidden={!open}
        ref={panelRef}
      >
        <div className="appearance-header">
          <div>
            <span className="appearance-eyebrow">YOUR SITE, YOUR ATMOSPHERE</span>
            <p>换个心情。</p>
          </div>
          <button
            type="button"
            className="appearance-close icon-button"
            aria-label="关闭外观设置"
            onClick={() => close(true)}
          >
            <Icon name="close" />
          </button>
        </div>

        <div>
          <h2 className="theme-group-label">THE SEASONS</h2>
          <div className="theme-grid">
            {THEMES.slice(0, 4).map((config) => (
              <ThemeOption key={config.id} config={config} active={config.id === theme} onPick={() => pick(config.id)} />
            ))}
          </div>
          <h2 className="theme-group-label essentials-label">THE ESSENTIALS</h2>
          <div className="theme-grid">
            {THEMES.slice(4).map((config) => (
              <ThemeOption key={config.id} config={config} active={config.id === theme} onPick={() => pick(config.id)} />
            ))}
          </div>
        </div>

        <div className="appearance-footer">
          <span className="preference-dot" />
          <span>{saved ? '保存在这台设备' : '本次有效'}</span>
          <kbd>esc</kbd>
        </div>
      </section>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { THEMES, type ThemeConfig } from '~/lib/theme'
import type { ReadingPreferences } from '~/lib/reading-preferences'
import { ContactDetails } from './ContactDetails'
import { Icon } from './Icon'
import { useReadingPreferences } from './ReadingPreferencesProvider'
import { useTheme } from './ThemeProvider'

/**
 * 外观面板：六套主题，选完不关，方便当场比较（参考站的行为）。
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

function PreferenceChoices<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: readonly { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  return (
    <fieldset className="reading-setting">
      <legend>{label}</legend>
      <div className="reading-choice-row">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className="reading-choice"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

export function ThemeMenu() {
  const { theme, setTheme } = useTheme()
  const { preferences, setPreferences, resetPreferences } = useReadingPreferences()
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState<'themes' | 'reading' | 'contact' | 'support'>('themes')
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

  const changePreference = <K extends keyof ReadingPreferences>(key: K, value: ReadingPreferences[K]) => {
    setSaved(setPreferences({ ...preferences, [key]: value }))
  }

  useEffect(() => {
    if (!open) return

    // 打开时把焦点放到当前选中的主题选项。
    panelRef.current?.querySelector<HTMLButtonElement>('[data-theme-choice][aria-pressed="true"]')?.focus()

    const onPointerDown = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close(true)
        return
      }

      const pageTabs = [...(panelRef.current?.querySelectorAll<HTMLButtonElement>('[data-page-tab]') ?? [])]
      const tabIndex = pageTabs.indexOf(document.activeElement as HTMLButtonElement)
      if (tabIndex >= 0) {
        const tabSteps: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 }
        let nextTab: number | undefined
        if (event.key in tabSteps) nextTab = (tabIndex + tabSteps[event.key]! + pageTabs.length) % pageTabs.length
        else if (event.key === 'Home') nextTab = 0
        else if (event.key === 'End') nextTab = pageTabs.length - 1
        if (nextTab !== undefined) {
          event.preventDefault()
          pageTabs[nextTab]?.focus()
          pageTabs[nextTab]?.click()
        }
        return
      }

      if (page !== 'themes') return
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
  }, [open, page])

  const pages = [
    { id: 'themes', label: '主题' },
    { id: 'reading', label: '排版' },
    { id: 'contact', label: '联系' },
    { id: 'support', label: '支持' },
  ] as const

  return (
    <div className="theme-wrap" ref={wrapRef}>
      <button
        type="button"
        className="theme-trigger"
        ref={triggerRef}
        aria-expanded={open}
        aria-controls="theme-menu"
        aria-label={`Personal menu, current theme ${current.name}`}
        onClick={() => {
          if (open) close()
          else {
            setPage('themes')
            setOpen(true)
          }
        }}
      >
        <Icon name="settings" />
        <span>{current.name}</span>
        <Icon name="chevron" className="theme-chevron" />
      </button>

      <section
        className="theme-menu appearance-panel"
        id="theme-menu"
        aria-label="Personal menu"
        hidden={!open}
        ref={panelRef}
      >
        <div className="appearance-header">
          <div>
            <span className="appearance-eyebrow">YOUR SPACE, YOUR WAY</span>
          </div>
          <button
            type="button"
            className="appearance-close icon-button"
            aria-label="Close personal menu"
            onClick={() => close(true)}
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="appearance-tabs" role="tablist" aria-label="个人功能">
          {pages.map((item) => (
            <button
              key={item.id}
              id={`appearance-tab-${item.id}`}
              type="button"
              role="tab"
              data-page-tab
              aria-selected={page === item.id}
              aria-controls="appearance-active-page"
              tabIndex={page === item.id ? 0 : -1}
              onClick={() => setPage(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div
          className="appearance-page"
          id="appearance-active-page"
          role="tabpanel"
          aria-labelledby={`appearance-tab-${page}`}
          tabIndex={0}
        >
          {page === 'themes' && (
            <>
              <div className="appearance-page-heading">
                <span className="appearance-eyebrow">YOUR GARDEN, YOUR ATMOSPHERE</span>
                <h2>Make yourself at home.</h2>
              </div>
              <h3 className="theme-group-label">THE SEASONS</h3>
              <div className="theme-grid">
                {THEMES.slice(0, 4).map((config) => (
                  <ThemeOption key={config.id} config={config} active={config.id === theme} onPick={() => pick(config.id)} />
                ))}
              </div>
              <h3 className="theme-group-label essentials-label">THE ESSENTIALS</h3>
              <div className="theme-grid">
                {THEMES.slice(4).map((config) => (
                  <ThemeOption key={config.id} config={config} active={config.id === theme} onPick={() => pick(config.id)} />
                ))}
              </div>
            </>
          )}

          {page === 'reading' && (
            <section className="reading-settings" aria-labelledby="reading-settings-title">
              <div className="appearance-page-heading">
                <span className="appearance-eyebrow">READING TYPOGRAPHY</span>
                <h2 id="reading-settings-title">Adjust long-form text to your comfort.</h2>
              </div>
              <PreferenceChoices<ReadingPreferences['font']>
                label="Font"
                value={preferences.font}
                options={[
                  { value: 'site', label: 'Site default' },
                  { value: 'sans', label: 'Sans' },
                  { value: 'serif', label: 'Serif' },
                ]}
                onChange={(value) => changePreference('font', value)}
              />
              <PreferenceChoices<ReadingPreferences['size']>
                label="Text size"
                value={preferences.size}
                options={[
                  { value: 'small', label: 'Small' },
                  { value: 'standard', label: 'Standard' },
                  { value: 'large', label: 'Large' },
                ]}
                onChange={(value) => changePreference('size', value)}
              />
              <PreferenceChoices<ReadingPreferences['lineSpacing']>
                label="Line spacing"
                value={preferences.lineSpacing}
                options={[
                  { value: 'compact', label: 'Compact' },
                  { value: 'comfortable', label: 'Comfort' },
                  { value: 'relaxed', label: 'Relaxed' },
                ]}
                onChange={(value) => changePreference('lineSpacing', value)}
              />
              <PreferenceChoices<ReadingPreferences['width']>
                label="Reading width"
                value={preferences.width}
                options={[
                  { value: 'narrow', label: 'Narrow' },
                  { value: 'standard', label: 'Standard' },
                  { value: 'wide', label: 'Wide' },
                ]}
                onChange={(value) => changePreference('width', value)}
              />
              <button type="button" className="reading-reset" onClick={() => setSaved(resetPreferences())}>
                Restore reading defaults
              </button>
            </section>
          )}

          {page === 'contact' && (
            <section className="personal-panel-page" aria-labelledby="contact-panel-title">
              <div className="appearance-page-heading">
                <span className="appearance-eyebrow">CONTACT & ELSEWHERE</span>
                <h2 id="contact-panel-title">Find me around the web.</h2>
              </div>
              <ContactDetails headingLevel={3} />
              <a className="contact-full-page-link" href="/contact/">打开完整联系页面 <span aria-hidden="true">↗</span></a>
            </section>
          )}

          {page === 'support' && (
            <section className="personal-panel-page support-panel-page" aria-labelledby="support-panel-title">
              <div className="appearance-page-heading">
                <span className="appearance-eyebrow">SUPPORT THE WORK</span>
                <h2 id="support-panel-title">A little support goes a long way.</h2>
              </div>
              <p className="personal-panel-message" role="status">
                支持方式还未配置。准备好后，可以在这里添加你提供的收款链接或二维码。
              </p>
            </section>
          )}
        </div>

        <div className="appearance-footer">
          <span className="preference-dot" />
          <span>{saved ? 'Preferences saved on this device' : 'Applied for this visit'}</span>
          <kbd>esc</kbd>
        </div>
      </section>
    </div>
  )
}

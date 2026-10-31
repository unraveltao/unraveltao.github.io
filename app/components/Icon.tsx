/**
 * 图标全部内联，不引图标库（AGENTS.md §4.4）。
 *
 * 原站把这批 <symbol> 直接写在 index.html 的 body 里，这里收进一个组件，
 * 由 root 挂一次，页面里用 <Icon name="arrow" /> 引用。
 */

import type { ReactNode } from 'react'

export type IconName =
  | 'arrow'
  | 'out'
  | 'search'
  | 'sun'
  | 'lock'
  | 'code'
  | 'file'
  | 'download'
  | 'check'
  | 'close'
  | 'copy'
  | 'leaf'
  | 'settings'
  | 'chevron'
  | 'sprout'
  | 'wave'
  | 'maple'
  | 'snow'
  | 'terminal'

const PATHS: Record<IconName, ReactNode> = {
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  out: <path d="M6 18 18 6M6 6h12v12" />,
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 4 4" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2" />
    </>
  ),
  code: <path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18" />,
  file: <path d="M14 2H5v20h14V7l-5-5Zm0 0v6h5M8 12h8m-8 4h6" />,
  download: <path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4" />,
  check: <path d="m5 12 4 4L19 6" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  copy: (
    <>
      <rect x="8" y="8" width="13" height="13" rx="2" />
      <path d="M16 8V3H3v13h5" />
    </>
  ),
  leaf: <path d="M4 20 17 7M7 17C-1 7 9 2 21 3c1 12-4 22-14 14Z" />,
  settings: (
    <>
      <path d="m9 3 1-1h4l1 3 3 1 3 2-1 3v2l1 3-3 2-3 1-1 3h-4l-1-3-3-1-3-2 1-3v-2L3 8l3-2 3-1Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  chevron: <path d="m7 9 5 5 5-5" />,
  sprout: <path d="M12 21V11M12 13C4 14 2 9 3 4c6 0 10 3 9 9Zm0-2c0-6 3-9 9-9 1 6-2 10-9 9Z" />,
  wave: (
    <>
      <path d="M2 12c3-5 6 5 10 0s6 5 10 0M2 18c3-5 6 5 10 0s6 5 10 0" />
      <circle cx="17" cy="5" r="2" />
    </>
  ),
  maple: <path d="m12 2 2 5 4-3-1 6 5-1-3 5 2 2-7 3-2-2-2 2-7-3 2-2-3-5 5 1-1-6 4 3 2-5Zm0 9v11" />,
  snow: (
    <path d="M12 2v20M3.4 7l17.2 10M3.4 17 20.6 7M9 4l3 3 3-3M9 20l3-3 3 3M3 10l4-1-1-4M21 14l-4 1 1 4M3 14l4 1-1 4M21 10l-4-1 1-4" />
  ),
  terminal: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m6 9 3 3-3 3m6 0h5" />
    </>
  ),
}

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg className={className ? `icon ${className}` : 'icon'} aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  )
}

/** 只挂一次，放在 root 的 body 顶部 */
export function IconSprite() {
  return (
    <svg className="icon-defs" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        {(Object.keys(PATHS) as IconName[]).map((name) => (
          <symbol key={name} id={`i-${name}`} viewBox="0 0 24 24">
            {PATHS[name]}
          </symbol>
        ))}
      </defs>
    </svg>
  )
}

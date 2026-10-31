import { THEMES } from '~/lib/theme'
import { useTheme } from './ThemeProvider'

/**
 * 首页右侧的季节插画，逐字取自原站 src/themes.js。
 *
 * 保留成字符串而不是改写 JSX：这段是纯装饰 SVG，一个路径上百个坐标，
 * 转 JSX 只会引入抄错的风险，而且以后对着原站改也更难比对。
 * 内容是常量，不含任何用户输入，dangerouslySetInnerHTML 在这里是安全的。
 */

const LATTICE = `<ellipse cx="200" cy="224" rx="133" ry="17" stroke="currentColor" opacity=".2"/><g stroke="currentColor" stroke-width="1.1"><path d="M81 191 201 129 321 191 201 254Z" opacity=".4"/><path d="M81 159 201 97 321 159 201 222Z" opacity=".6"/><path d="M81 127 201 65 321 127 201 190Z"/><path d="m81 127 120 63 120-63v64l-120 63-120-63Z" opacity=".6"/><path d="M201 190v64M121 148l120-62m-80 83 120-62M121 106l120 63m-80-84 120 63" opacity=".45"/><path d="M201 65V32m-6 5 6-5 6 5M81 127l-25-13m4 8-4-8 9-1M321 127l25-13m-9-1 9 1-4 8" opacity=".6"/><path d="M201 65v64m-80-22v64m160-64v64" stroke-dasharray="3 5" opacity=".45"/></g><path d="m201 65 40 21-40 21-40-21Z" fill="currentColor" opacity=".15"/><circle cx="201" cy="65" r="4" fill="currentColor"/><circle cx="321" cy="127" r="3" fill="currentColor"/><circle cx="81" cy="127" r="3" fill="currentColor"/>`

const LEAF = 'M0-57 12-25 33-40 27-9 58-18 43 8 61 21 20 40 15 65 0 55-15 65-20 40-61 21-43 8-58-18-27-9-33-40-12-25Z'

const snowflake = (x: number, y: number, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})" stroke="currentColor" stroke-width="1.4"><path d="M0-10V10M-8.7-5 8.7 5M-8.7 5 8.7-5M-3-7 0-4 3-7M-3 7 0 4 3 7M-7-1-3-2-4-6M7 1 3 2 4 6M-7 1-3 2-4 6M7-1 3-2 4-6"/></g>`

const SCENES: Record<string, string> = {
  spring: `${LATTICE}<g stroke="currentColor" fill="none" stroke-width="1.2" opacity=".7"><path d="M332 222c-3-20 0-35 9-48m-7 25c-15-1-22-8-20-20 13 2 20 8 20 20m3-11c1-14 9-20 21-19-2 13-9 19-21 19"/></g>`,
  summer: `<circle cx="277" cy="76" r="33" fill="var(--season-sun)"/><circle cx="277" cy="76" r="44" stroke="var(--season-sun)" opacity=".45"/><path d="M0 133Q60 121 120 133T240 133T400 133V270H0Z" fill="var(--season-sea)"/><path d="M0 172Q60 159 120 172T240 172T400 172" stroke="white" opacity=".65" stroke-width="2"/><path d="M0 207Q80 162 170 199T400 190V270H0Z" fill="var(--season-sand)"/><path d="M0 226Q80 184 170 218T400 209" stroke="white" stroke-width="2" opacity=".65"/><g stroke="currentColor" stroke-width="1.2" opacity=".65"><path d="M84 79q9-8 18 0 9-8 18 0m23 19q6-6 12 0 6-6 12 0" fill="none"/><path d="m262 195 10 8-12 5m-2-10 4-3 5 4" fill="none"/></g><ellipse cx="99" cy="226" rx="15" ry="3" fill="currentColor" opacity=".12"/><path d="m88 220 10-12 11 12Z" fill="var(--season-sun)" opacity=".9"/>`,
  autumn: `<ellipse cx="200" cy="235" rx="133" ry="12" fill="currentColor" opacity=".07"/><circle cx="215" cy="127" r="95" stroke="currentColor" opacity=".12"/><g transform="translate(210 126) rotate(-18)"><path d="${LEAF}" fill="var(--season-leaf)"/><path d="M0-44V88M0 14 26-8M0 24-28 3" stroke="var(--season-vein)" fill="none" stroke-width="1.4"/></g><g transform="translate(89 167) rotate(32) scale(.39)"><path d="${LEAF}" fill="var(--season-gold)"/><path d="M0-40V85M0 13 25-8M0 24-27 3" stroke="var(--season-vein)" fill="none" stroke-width="2"/></g><g transform="translate(315 74) rotate(34) scale(.25)"><path d="${LEAF}" fill="var(--season-gold)"/><path d="M0-40V85" stroke="var(--season-vein)" stroke-width="2"/></g><path d="M65 242q100-9 266 0" stroke="currentColor" fill="none" opacity=".25"/>`,
  winter: `<circle cx="283" cy="73" r="25" fill="white" opacity=".8"/><path d="M0 230 125 83l116 147Z" fill="var(--season-mountain)"/><path d="m125 83-47 55 33-9 15 14 16-16 24 6Z" fill="white"/><path d="m137 244 122-145 141 145Z" fill="var(--season-ice)"/><path d="m259 99-45 54 30-8 16 13 15-15 25 7Z" fill="white"/><path d="M0 217q90-18 200 13t200-5v45H0Z" fill="white" opacity=".9"/><path d="M45 245q66-10 133 0m47-1q56-10 127-1" stroke="currentColor" fill="none" opacity=".15"/><g opacity=".7">${snowflake(68, 78, 0.65)}${snowflake(195, 52, 0.8)}${snowflake(335, 133, 0.65)}${snowflake(52, 174, 0.4)}</g>`,
}

const CAPTIONS: Record<string, string> = {
  spring: 'ROOM TO GROW.',
  summer: 'A LITTLE SEA. A LITTLE POSSIBILITY.',
  autumn: 'GOOD IDEAS TAKE ROOT.',
  winter: 'SPACE TO THINK CLEARLY.',
}

const THEME_LABEL: Record<string, string> = {
  spring: 'spring',
  summer: 'summer',
  autumn: 'autumn',
  winter: 'winter',
}

const TERMINAL = `<div class="terminal-top"><span><i></i><i></i><i></i></span><b>garden / terminal</b><span>⌘ 01</span></div><div class="terminal-code"><div class="terminal-comment">// curiosity is the entry point.</div><div class="terminal-command"><span>iron@garden</span>:~$ ./explore</div><pre><span class="code-key">const</span> garden = {
  curiosity: <span class="code-value">Infinity</span>,
  mode: <span class="code-string">"build &amp; learn"</span>,
  ideas: [<span class="code-string">"Lattice"</span>, <span class="code-string">"Writing"</span>]
};</pre><div class="terminal-comment">&gt; garden.grow()</div><div class="terminal-ready">✓ ready when you are<span class="terminal-cursor">_</span></div></div>`

export function GardenArt() {
  const { theme } = useTheme()

  // terminal 标记写在主题定义里（lib/theme.ts），Hacker 和 Geeker 共用这套插画，
  // 差别只在配色——所以这里判标记，不判 id。
  const isTerminal = THEMES.find((item) => item.id === theme)?.terminal

  if (isTerminal) {
    return (
      <div className="garden-art" aria-hidden="true">
        <div className="terminal-art" dangerouslySetInnerHTML={{ __html: TERMINAL }} />
        <span className="art-caption">STAY CURIOUS. KEEP BUILDING.</span>
        <span className="art-mark">{'</>'}</span>
      </div>
    )
  }

  return (
    <div className="garden-art" aria-hidden="true">
      <svg
        className="season-scene"
        viewBox="0 0 400 270"
        fill="none"
        dangerouslySetInnerHTML={{ __html: SCENES[theme] ?? SCENES.spring ?? '' }}
      />
      <span className="art-caption">{CAPTIONS[theme] ?? CAPTIONS.spring}</span>
      <span className="art-mark">{THEME_LABEL[theme] ?? 'spring'} / 01</span>
    </div>
  )
}

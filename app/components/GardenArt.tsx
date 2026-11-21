import { THEMES } from '~/lib/theme'
import { useTheme } from './ThemeProvider'

/**
 * 首页右侧的季节插画，逐字取自参考站 src/themes.js。
 *
 * 保留成字符串而不是改写 JSX：这段是纯装饰 SVG，一个路径上百个坐标，
 * 转 JSX 只会引入抄错的风险。内容是常量，不含用户输入。
 */

const LEAF = 'M0-57 12-25 33-40 27-9 58-18 43 8 61 21 20 40 15 65 0 55-15 65-20 40-61 21-43 8-58-18-27-9-33-40-12-25Z'

const snowflake = (x: number, y: number, s = 1, delay = '0s') =>
  `<g transform="translate(${x} ${y})"><g class="winter-flake-drift"><g transform="scale(${s})" stroke="currentColor" stroke-width="1.4"><path d="M0-10V10M-8.7-5 8.7 5M-8.7 5 8.7-5M-3-7 0-4 3-7M-3 7 0 4 3 7M-7-1-3-2-4-6M7 1 3 2 4 6M-7 1-3 2-4 6M7-1 3-2 4-6"/></g><animateTransform class="winter-flake-motion" attributeName="transform" attributeType="XML" type="translate" values="0 0;6 24;-4 48;5 72;-2 96" keyTimes="0;.25;.5;.75;1" dur="16s" begin="${delay}" repeatCount="indefinite"/></g></g>`

const SCENES: Record<string, string> = {
  spring: `<defs><radialGradient id="spring-halo"><stop stop-color="currentColor" stop-opacity=".12"/><stop offset="1" stop-color="currentColor" stop-opacity="0"/></radialGradient></defs>
    <circle class="spring-halo" cx="200" cy="137" r="104" fill="url(#spring-halo)"/>
    <circle class="spring-daylight" cx="200" cy="128" r="104" fill="var(--season-sun)" opacity=".1"/>
    <path d="M0 177c52-20 100-17 147-3 36 11 69 11 106-1 51-16 99-16 147 3v93H0Z" fill="currentColor" opacity=".035"/>
    <path class="spring-ground" d="M0 190c48-15 89-12 132 0 46 13 88 12 132-1 51-15 91-15 136 1v79H0Z" fill="var(--accent-soft)" opacity=".22"/>
    <g class="spring-breeze" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.2" opacity=".2">
      <path class="spring-breeze-line spring-breeze-one" d="M18 113c22-12 38 10 61 1 15-6 23-15 43-10"/>
      <path class="spring-breeze-line spring-breeze-two" d="M278 127c19-11 34 9 53 1 16-6 25-14 50-9"/>
      <path class="spring-breeze-line spring-breeze-three" d="M20 166c19-9 31 8 49 1 13-5 19-11 34-8"/>
    </g>
    <ellipse cx="200" cy="222" rx="88" ry="15" fill="currentColor" opacity=".06"/>
    <path class="spring-soil" d="M119 218c17-17 42-23 81-20 38-4 64 3 81 20-18 8-44 12-81 12s-64-4-81-12Z" fill="currentColor" opacity=".09"/>
    <g class="spring-orbit" fill="none" stroke="currentColor" stroke-width="1.1"><path d="M105 142c20-57 74-91 128-77 47 12 72 57 60 98-13 44-64 68-113 55-37-10-58-38-54-69 4-26 29-44 56-39 21 4 33 23 28 41"/><path d="M130 95c35 9 65 27 88 53 17 19 34 32 61 42" opacity=".48"/></g>
    <g fill="var(--surface)"><circle class="spring-node spring-node-one" cx="105" cy="142" r="4"/><circle class="spring-node spring-node-two" cx="293" cy="163" r="4"/><circle class="spring-node spring-node-three" cx="157" cy="149" r="3"/></g>
    <g class="spring-stem" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M200 210c-2-28 1-52 0-76-1-20 5-34 15-45" stroke-width="3.4"/><path class="spring-leaf spring-leaf-left" d="M199 159c-21-1-34-13-34-32 20 1 32 11 34 32Z" fill="var(--accent-soft)" stroke-width="1.4"/><path class="spring-leaf spring-leaf-right" d="M201 138c2-20 15-31 34-30-2 19-14 29-34 30Z" fill="var(--accent-soft)" stroke-width="1.4"/><path d="M201 116c-2-13 3-23 13-31" stroke-width="1.2" opacity=".65"/><circle cx="215" cy="84" r="3.5" fill="var(--season-sun)" stroke="none"/></g>
    <g fill="currentColor" opacity=".36"><path d="M133 209c1-10 7-16 17-17 0 10-6 16-17 17Z"/><path d="M267 207c-1-10-7-16-17-17 0 10 6 16 17 17Z"/></g>
    <g class="spring-stars" fill="#f7f1d9" opacity="0"><circle cx="78" cy="56" r="1.6"/><circle cx="126" cy="83" r="1.1"/><circle cx="181" cy="43" r="1.4"/><circle cx="236" cy="69" r="1.1"/><circle cx="301" cy="45" r="1.7"/><circle cx="344" cy="86" r="1.2"/><circle cx="93" cy="111" r="1"/><circle cx="275" cy="112" r="1.3"/></g>
    <circle class="spring-static-sun" cx="65" cy="148" r="17" fill="var(--season-sun)" opacity="0"/>
    <g class="spring-sun" transform="translate(65 148)" fill="var(--season-sun)" opacity="1"><circle r="17"/><circle r="24" fill="var(--season-sun)" opacity=".14"/><animateTransform attributeName="transform" attributeType="XML" type="translate" dur="60s" repeatCount="indefinite" calcMode="spline" keyTimes="0;.08;.17;.25;.33;.42;.5;.73;.96;1" keySplines=".42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1" values="65 148;85 85;145 45;200 32;255 45;315 85;335 148;200 240;65 148;65 148"/></g>
    <g class="spring-moon" transform="translate(65 240)" opacity="0"><circle r="13" fill="#f7f1d9"/><circle cx="6" cy="-4" r="11" fill="#101b31"/><animateTransform attributeName="transform" attributeType="XML" type="translate" dur="60s" repeatCount="indefinite" calcMode="spline" keyTimes="0;.48;.5;.58;.67;.75;.83;.92;.96;1" keySplines=".42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1" values="65 240;65 240;65 148;85 85;145 45;200 32;255 45;315 85;335 148;335 240"/></g>`,
  summer: `<defs><clipPath id="summer-water-clip"><path d="M0 168Q48 158 102 168T205 167T310 166T400 168V270H0Z"/></clipPath></defs>
    <path d="M0 155Q40 147 78 159T154 164M246 164Q302 156 344 157T400 151V168Q350 173 300 168T205 169T100 169T0 173Z" fill="var(--season-sea)" opacity=".42"/>
    <path d="M0 127Q28 117 53 132T97 157L124 177 0 180Z" fill="var(--season-coast)" opacity=".82"/><path d="M0 145Q28 135 53 149T96 169L119 179 0 182Z" fill="var(--season-cliff)"/><path d="M0 127Q28 117 53 132T97 157L124 177M0 145Q28 135 53 149T96 169" fill="none" stroke="var(--season-vein)" stroke-width="1.2" opacity=".62"/><path d="m32 128 11 13-6 10m18-18 10 17-6 9m16-4 12 14-7 8" fill="none" stroke="var(--season-vein)" stroke-width=".8" opacity=".48"/>
    <path d="M400 127Q372 117 347 132T303 157L276 177 400 180Z" fill="var(--season-coast)" opacity=".82"/><path d="M400 145Q372 135 347 149T304 169L281 179 400 182Z" fill="var(--season-cliff)"/><path d="M400 127Q372 117 347 132T303 157L276 177M400 145Q372 135 347 149T304 169" fill="none" stroke="var(--season-vein)" stroke-width="1.2" opacity=".62"/><path d="m368 128-11 13 6 10m-18-18-10 17 6 9m-16-4-12 14 7 8" fill="none" stroke="var(--season-vein)" stroke-width=".8" opacity=".48"/>
    <path d="M0 168Q48 158 102 168T205 167T310 166T400 168V270H0Z" fill="var(--season-sea)"/>
    <path d="M66 95q14-9 28 0t30 0m156 16q12-7 24 0t25 0" fill="none" stroke="white" stroke-width="7" stroke-linecap="round" opacity=".34"/>
    <g class="summer-orbit" fill="none" stroke="var(--season-gold)" stroke-width="1" stroke-dasharray="2 7" opacity=".54"><path d="M77 137C97 44 302 20 334 136"/></g>
    <g class="summer-sun" transform="translate(55 116)" fill="var(--season-sun)"><circle r="31"/><circle r="42" opacity=".13"/><animateTransform attributeName="transform" attributeType="XML" type="translate" dur="60s" repeatCount="indefinite" calcMode="spline" keyTimes="0;.08;.17;.25;.33;.42;.5;.73;.96;1" keySplines=".42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1" values="55 116;78 70;145 34;200 22;255 34;322 70;345 116;345 116;345 116;55 116"/></g>
    <g class="summer-birds" transform="translate(-60 78)" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g class="summer-bird"><path class="summer-bird-wing summer-bird-wing-left" d="M16 1Q7-8 0-1"/><path class="summer-bird-wing summer-bird-wing-right" d="M16 1Q25-8 32-1"/><path d="M13 1q3 3 6 0"/></g><g class="summer-bird" transform="translate(23 13) scale(.7)"><path class="summer-bird-wing summer-bird-wing-left" d="M16 1Q7-8 0-1"/><path class="summer-bird-wing summer-bird-wing-right" d="M16 1Q25-8 32-1"/><path d="M13 1q3 3 6 0"/></g><g class="summer-bird" transform="translate(47-3) scale(.82)"><path class="summer-bird-wing summer-bird-wing-left" d="M16 1Q7-8 0-1"/><path class="summer-bird-wing summer-bird-wing-right" d="M16 1Q25-8 32-1"/><path d="M13 1q3 3 6 0"/></g><animateTransform attributeName="transform" attributeType="XML" type="translate" dur="60s" repeatCount="indefinite" keyTimes="0;.35;.48;1" values="-60 78;460 66;460 66;-60 78"/></g>
    <g class="summer-sailboat" transform="translate(200 170)"><path d="M-12 8h25l-4 5H-8Z" fill="var(--season-vein)"/><path d="M0-25V8" stroke="var(--season-vein)" stroke-width="1.2"/><path d="M-2-22v25l-14 2Z" fill="var(--surface)" stroke="var(--season-vein)" stroke-width=".8"/><path d="M2-19v22l12-2Z" fill="var(--season-sand)" stroke="var(--season-vein)" stroke-width=".8"/><animateTransform attributeName="transform" attributeType="XML" type="translate" values="200 170;200 169;200 170;200 171;200 170" dur="4.8s" repeatCount="indefinite"/></g>
    <g class="summer-waves" clip-path="url(#summer-water-clip)" fill="none" stroke-linecap="round"><g stroke="white" stroke-width="2" opacity=".68"><path d="M-18 188q36-11 72 0t72 0 72 0 72 0 72 0 72 0"/><path d="M-30 218q46-13 92 0t92 0 92 0 92 0 92 0"/><path d="M-12 248q34-10 68 0t68 0 68 0 68 0 68 0 68 0"/></g><g stroke="var(--season-sea)" stroke-width="1.4" opacity=".75"><path d="M-30 201q42 10 84 0t84 0 84 0 84 0 84 0 84 0"/><path d="M-30 234q50 11 100 0t100 0 100 0 100 0 100 0"/><path d="M-20 260q38 8 76 0t76 0 76 0 76 0 76 0 76 0"/></g><animateTransform attributeName="transform" attributeType="XML" type="translate" values="0 0;8 1;0 0;-8 -1;0 0" dur="5.6s" repeatCount="indefinite"/></g>
    <g class="summer-wave-glints" clip-path="url(#summer-water-clip)" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" opacity=".8"><path d="M0 196q22-6 44 0t44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0" stroke-dasharray="26 370"><animate attributeName="stroke-dashoffset" from="0" to="-396" dur="7s" repeatCount="indefinite"/></path><path d="M-22 231q26-7 52 0t52 0 52 0 52 0 52 0 52 0 52 0 52 0" stroke-dasharray="20 396"><animate attributeName="stroke-dashoffset" from="-396" to="0" dur="8s" repeatCount="indefinite"/></path></g>
    <rect class="summer-night-overlay" width="400" height="270" fill="#14233a" opacity="0"/>
    <g class="summer-stars" fill="#fff4d2" opacity="0"><circle cx="68" cy="72" r="1.5"/><circle cx="114" cy="46" r="1"/><circle cx="151" cy="84" r="1.3"/><circle cx="224" cy="56" r="1.4"/><circle cx="282" cy="79" r="1"/><circle cx="344" cy="55" r="1.6"/><circle cx="91" cy="119" r="1"/><circle cx="304" cy="118" r="1.2"/><circle cx="190" cy="95" r=".9"/></g>
    <circle class="summer-static-sun" cx="55" cy="116" r="31" fill="var(--season-sun)" opacity="0"/>
    <g class="summer-moon" transform="translate(55 244)" opacity="0"><circle r="15" fill="#fff4d2"/><circle cx="7" cy="-5" r="13" fill="#14233a"/><animateTransform attributeName="transform" attributeType="XML" type="translate" dur="60s" repeatCount="indefinite" calcMode="spline" keyTimes="0;.45;.48;.5;.58;.67;.75;.83;.92;.96;1" keySplines=".42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1" values="55 244;55 244;55 244;55 116;78 70;145 34;200 22;255 34;322 70;345 116;345 116"/></g>`,
  autumn: `<ellipse cx="200" cy="235" rx="133" ry="12" fill="currentColor" opacity=".07"/><g class="autumn-tree autumn-tree-left" fill="none" stroke="var(--season-vein)" stroke-linecap="round" opacity=".58"><path d="M42 242Q54 161 72 27M55 173Q33 128 14 80M63 132q29-38 57-69" stroke-width="6"/><path d="M72 83q-18-20-31-38m44 48q25-19 39-40" stroke-width="2.5"/><g fill="var(--season-leaf)" stroke="none"><path d="${LEAF}" transform="translate(35 49) scale(.43)"/><path d="${LEAF}" transform="translate(79 34) scale(.4)" fill="var(--season-gold)"/><path d="${LEAF}" transform="translate(20 82) scale(.34)" fill="var(--season-gold)"/><path d="${LEAF}" transform="translate(105 73) scale(.34)"/></g></g><g class="autumn-tree autumn-tree-right" fill="none" stroke="var(--season-vein)" stroke-linecap="round" opacity=".55"><path d="M358 242Q346 160 330 32M348 174q24-40 43-86m-54 48q-29-38-55-70" stroke-width="6"/><path d="M331 85q18-21 31-39m-43 48q-25-19-39-40" stroke-width="2.5"/><g fill="var(--season-gold)" stroke="none"><path d="${LEAF}" transform="translate(366 49) scale(.43)"/><path d="${LEAF}" transform="translate(322 37) scale(.4)" fill="var(--season-leaf)"/><path d="${LEAF}" transform="translate(381 85) scale(.34)"/><path d="${LEAF}" transform="translate(297 73) scale(.34)" fill="var(--season-leaf)"/></g></g><g class="autumn-breeze" fill="none" stroke="var(--surface)" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="22 68" opacity=".42"><path d="M93 126q20-12 42-3t44-1"/><path d="M221 149q20-10 38-2t34-1"/></g><circle cx="215" cy="127" r="95" stroke="currentColor" opacity=".12"/><g transform="translate(210 126) rotate(-18)"><path d="${LEAF}" fill="var(--season-leaf)"/><path d="M0-44V88M0 14 26-8M0 24-28 3" stroke="var(--season-vein)" fill="none" stroke-width="1.4"/></g><g transform="translate(89 167) rotate(32) scale(.39)"><path d="${LEAF}" fill="var(--season-gold)"/><path d="M0-40V85M0 13 25-8M0 24-27 3" stroke="var(--season-vein)" fill="none" stroke-width="2"/></g><g transform="translate(315 74) rotate(34) scale(.25)"><path d="${LEAF}" fill="var(--season-gold)"/><path d="M0-40V85" stroke="var(--season-vein)" stroke-width="2"/></g><g class="autumn-ground-leaves" fill="var(--season-leaf)" opacity=".9"><path d="${LEAF}" transform="translate(47 225) rotate(72) scale(.14)"/><path d="${LEAF}" transform="translate(93 231) rotate(-24) scale(.12)" fill="var(--season-gold)"/><path d="${LEAF}" transform="translate(151 222) rotate(38) scale(.13)"/><path d="${LEAF}" transform="translate(244 231) rotate(-41) scale(.12)" fill="var(--season-gold)"/><path d="${LEAF}" transform="translate(313 221) rotate(64) scale(.13)"/><path d="${LEAF}" transform="translate(357 232) rotate(-16) scale(.11)" fill="var(--season-gold)"/></g><g class="autumn-falling-leaf autumn-fall-one" fill="var(--season-leaf)"><g class="autumn-fall-rotation"><path d="${LEAF}"/><path d="M0-38V61M0 8 25-10M0 18-24 1" fill="none" stroke="var(--season-vein)" stroke-width="2"/></g><animateTransform attributeName="transform" attributeType="XML" type="translate" values="121 37;139 75;119 116;143 164;131 207" keyTimes="0;.24;.5;.76;1" keySplines=".42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1" calcMode="spline" dur="15s" begin="-4s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;1;1;0" keyTimes="0;.08;.5;.88;1" dur="15s" begin="-4s" repeatCount="indefinite"/></g><g class="autumn-falling-leaf autumn-fall-two" fill="var(--season-gold)"><g class="autumn-fall-rotation"><path d="${LEAF}"/><path d="M0-38V61M0 8 25-10M0 18-24 1" fill="none" stroke="var(--season-vein)" stroke-width="2"/></g><animateTransform attributeName="transform" attributeType="XML" type="translate" values="276 23;254 65;281 109;258 158;274 207" keyTimes="0;.24;.5;.76;1" keySplines=".42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1" calcMode="spline" dur="18s" begin="-11s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;1;1;0" keyTimes="0;.08;.5;.88;1" dur="18s" begin="-11s" repeatCount="indefinite"/></g><g class="autumn-falling-leaf autumn-fall-three" fill="var(--season-leaf)"><g class="autumn-fall-rotation"><path d="${LEAF}"/><path d="M0-38V61M0 8 25-10M0 18-24 1" fill="none" stroke="var(--season-vein)" stroke-width="2"/></g><animateTransform attributeName="transform" attributeType="XML" type="translate" values="197 10;216 53;194 98;220 149;205 207" keyTimes="0;.24;.5;.76;1" keySplines=".42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1" calcMode="spline" dur="17s" begin="-8s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;1;1;0" keyTimes="0;.08;.5;.88;1" dur="17s" begin="-8s" repeatCount="indefinite"/></g><path d="M65 242q100-9 266 0" stroke="currentColor" fill="none" opacity=".25"/>`,
  winter: `<g class="winter-sun" transform="translate(328 52)" fill="var(--season-sun)" opacity=".95"><circle r="12"/><circle r="19" opacity=".18"/><animateTransform class="winter-sun-motion" attributeName="transform" attributeType="XML" type="translate" dur="60s" repeatCount="indefinite" calcMode="spline" keyTimes="0;.18;.34;.43;.48;.5;1" keySplines=".42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1" values="328 52;352 72;340 94;320 116;304 135;304 135;328 52"/></g><g class="winter-moon" transform="translate(75 190)" opacity="0"><circle r="12" fill="#fffef9"/><circle cx="6" cy="-5" r="11" fill="var(--art)"/><animateTransform class="winter-moon-motion" attributeName="transform" attributeType="XML" type="translate" dur="60s" repeatCount="indefinite" calcMode="spline" keyTimes="0;.45;.5;.58;.68;.76;.94;.98;1" keySplines=".42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1" values="75 190;75 190;75 157;75 126;92 91;124 66;124 66;75 190;75 190"/></g><path d="M0 230 125 83l116 147Z" fill="var(--season-mountain)"/><path d="m125 83-47 55 33-9 15 14 16-16 24 6Z" fill="white"/><path d="m137 244 122-145 141 145Z" fill="var(--season-ice)"/><path d="m259 99-45 54 30-8 16 13 15-15 25 7Z" fill="white"/><path d="M0 217q90-18 200 13t200-5v45H0Z" fill="white" opacity=".9"/><path d="M45 245q66-10 133 0m47-1q56-10 127-1" stroke="currentColor" fill="none" opacity=".15"/><g opacity=".7">${snowflake(68, 78, 0.65, '-4s')}${snowflake(195, 52, 0.8, '-10s')}${snowflake(335, 133, 0.65, '-7s')}${snowflake(52, 174, 0.4, '-13s')}${snowflake(250, 78, 0.5, '-2s')}</g>`,
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

const TERMINAL = `<div class="terminal-top"><span><i></i><i></i><i></i></span><b>garden / terminal</b><span>⌘ 01</span></div>
<div class="terminal-screen">
  <section class="terminal-frame terminal-frame-bug">
    <div class="terminal-prompt">$ ./garden</div>
    <pre><span class="code-key">fn</span> main() {
  plant();
  <span class="terminal-bug-line">plant!();</span>
  harvest();
}</pre>
    <div class="terminal-error"><b>!</b> bug: unknown macro <code>plant!</code></div>
  </section>
  <section class="terminal-frame terminal-frame-rain" aria-hidden="true">
    <div class="terminal-matrix"><span>0<br/>1<br/>0<br/>1<br/>1<br/>0<br/>1<br/>0<br/>1<br/>1<br/>0<br/>1</span><span>1<br/>0<br/>1<br/>0<br/>0<br/>1<br/>0<br/>1<br/>0<br/>1<br/>1<br/>0</span><span>0<br/>1<br/>1<br/>0<br/>1<br/>0<br/>1<br/>1<br/>0<br/>0<br/>1<br/>0</span><span>1<br/>1<br/>0<br/>1<br/>0<br/>1<br/>0<br/>0<br/>1<br/>0<br/>1<br/>1</span><span>0<br/>0<br/>1<br/>0<br/>1<br/>1<br/>0<br/>1<br/>0<br/>1<br/>0<br/>1</span><span>1<br/>0<br/>0<br/>1<br/>0<br/>1<br/>1<br/>0<br/>1<br/>0<br/>1<br/>0</span><span>0<br/>1<br/>0<br/>1<br/>1<br/>0<br/>1<br/>0<br/>1<br/>0<br/>1<br/>1</span><span>1<br/>0<br/>1<br/>0<br/>1<br/>0<br/>0<br/>1<br/>0<br/>1<br/>0<br/>1</span><span>0<br/>1<br/>1<br/>0<br/>0<br/>1<br/>0<br/>1<br/>1<br/>0<br/>1<br/>0</span><span>1<br/>0<br/>0<br/>1<br/>1<br/>0<br/>1<br/>0<br/>1<br/>0<br/>0<br/>1</span><span>0<br/>1<br/>0<br/>0<br/>1<br/>1<br/>0<br/>1<br/>0<br/>1<br/>1<br/>0</span><span>1<br/>1<br/>0<br/>1<br/>0<br/>0<br/>1<br/>1<br/>0<br/>1<br/>0<br/>1</span><span>0<br/>0<br/>1<br/>1<br/>0<br/>1<br/>0<br/>1<br/>0<br/>0<br/>1<br/>1</span><span>1<br/>0<br/>1<br/>0<br/>1<br/>1<br/>0<br/>0<br/>1<br/>0<br/>1<br/>0</span><span>0<br/>1<br/>0<br/>1<br/>0<br/>1<br/>1<br/>0<br/>1<br/>1<br/>0<br/>1</span><span>1<br/>0<br/>0<br/>1<br/>0<br/>1<br/>0<br/>1<br/>1<br/>0<br/>1<br/>0</span><span>0<br/>1<br/>1<br/>0<br/>1<br/>0<br/>0<br/>1<br/>0<br/>1<br/>0<br/>1</span><span>1<br/>0<br/>1<br/>1<br/>0<br/>1<br/>0<br/>0<br/>1<br/>1<br/>0<br/>1</span><span>0<br/>1<br/>0<br/>1<br/>1<br/>0<br/>1<br/>0<br/>0<br/>1<br/>0<br/>1</span><span>1<br/>0<br/>1<br/>0<br/>1<br/>0<br/>1<br/>1<br/>0<br/>1<br/>0<br/>0</span></div>
    <div class="terminal-glitch">0101 ▪ 1010 ▪ 0011</div>
  </section>
  <section class="terminal-frame terminal-frame-clear">
    <div class="terminal-prompt">$ ./garden<span class="terminal-cursor">_</span></div>
    <div class="terminal-comment">// resetting the buffer...</div>
  </section>
  <section class="terminal-frame terminal-frame-fixed">
    <div class="terminal-prompt">$ ./garden</div>
    <pre><span class="terminal-code-line terminal-type-line-one"><span class="code-key">fn</span> main() {</span><span class="terminal-code-line terminal-type-line-two">  plant();</span><span class="terminal-code-line terminal-type-line-three">  <span class="code-key">println!</span>(<span class="code-string">"Hello, world!"</span>);</span><span class="terminal-code-line terminal-type-line-four">  harvest();</span><span class="terminal-code-line terminal-type-line-five">}</span></pre>
    <div class="terminal-fixed">✓ bug fixed</div>
  </section>
  <section class="terminal-frame terminal-frame-loading">
    <div class="terminal-prompt">$ ./garden</div>
    <div class="terminal-loading-label">Building garden... <span>64%</span></div>
    <div class="terminal-progress"><i></i></div>
  </section>
  <section class="terminal-frame terminal-frame-result">
    <div class="terminal-result-label">✓ ready when you are</div>
    <svg class="terminal-garden-result" viewBox="0 0 240 112" role="presentation"><path class="garden-ground" d="M20 94q100-10 200 0"/><path class="garden-stem" d="M120 91V45M78 91V61m84 30V59"/><path class="garden-bloom" d="M120 46c-15-17-29 1 0 16 29-15 15-33 0-16Zm-42 15c-13-14-24 1 0 13 24-12 13-27 0-13Zm84-2c-13-14-24 1 0 13 24-12 13-27 0-13Z"/><path class="garden-leaves" d="M119 74q-18-20-27-7 8 12 27 7Zm3-12q15-19 25-7-7 12-25 7Z"/><path class="garden-rays" d="M120 20v-8m-15 13-5-6m35 6 5-6"/></svg>
    <div class="terminal-result-foot">build complete <span>✦</span></div>
  </section>
</div>`
export function GardenArt() {
  const { theme } = useTheme()

  // terminal 标记写在主题定义里（lib/theme.ts），Hacker 与 Geeker 共用这套插画，
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
        className={`season-scene${theme === 'spring' ? ' spring-cycle-scene' : ''}${theme === 'summer' ? ' summer-cycle-scene' : ''}`}
        viewBox="0 0 400 270"
        preserveAspectRatio={theme === 'spring' || theme === 'summer' ? 'xMidYMid slice' : 'xMidYMid meet'}
        fill="none"
        dangerouslySetInnerHTML={{ __html: SCENES[theme] ?? SCENES.spring ?? '' }}
      />
      <span className="art-caption">{CAPTIONS[theme] ?? CAPTIONS.spring}</span>
      <span className="art-mark">{THEME_LABEL[theme] ?? 'spring'} / 01</span>
    </div>
  )
}

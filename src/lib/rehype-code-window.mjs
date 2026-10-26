/**
 * 把 shiki 产出的 <pre class="astro-code"> 包进一个 macOS 风格的窗口：
 *
 *   <figure class="code-window" data-language="rust">
 *     <div class="code-window__bar">
 *       <span class="code-window__dots" aria-hidden="true">
 *         <span class="code-window__dot"></span> ×3
 *       </span>
 *       <span class="code-window__lang">rust</span>
 *     </div>
 *     <pre class="astro-code">…</pre>
 *   </figure>
 *
 * 为什么不纯用 CSS 画三个点：::before 在 pre 内部会跟着横向滚动条一起跑，
 * 需要一个真实的外层元素把标题栏固定住。
 *
 * 注意：shiki 在本插件之前执行，属性名是 hast 的驼峰形式
 * （class 是字符串、语言在 dataLanguage），不是 'data-language'。
 */

const HIDDEN_LANGS = new Set(['', 'plaintext', 'text', 'txt']);

function text(value) {
  return { type: 'text', value };
}

function element(tagName, properties, children = []) {
  return { type: 'element', tagName, properties, children };
}

function classList(node) {
  const raw = node?.properties?.class ?? node?.properties?.className;
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') return raw.split(/\s+/).filter(Boolean);
  return [];
}

function detectLanguage(pre) {
  const fromPre = pre.properties?.dataLanguage ?? pre.properties?.['data-language'];
  if (fromPre) return String(fromPre);

  const code = pre.children?.find((c) => c.type === 'element' && c.tagName === 'code');
  const hit = classList(code).find((c) => c.startsWith('language-'));
  return hit ? hit.slice('language-'.length) : '';
}

function buildWindow(pre) {
  const lang = detectLanguage(pre);
  const showLang = !HIDDEN_LANGS.has(lang.toLowerCase());

  const dots = element('span', { class: 'code-window__dots', 'aria-hidden': 'true' }, [0, 1, 2].map(() =>
    element('span', { class: 'code-window__dot' }),
  ));

  const bar = element(
    'div',
    { class: 'code-window__bar' },
    showLang ? [dots, element('span', { class: 'code-window__lang' }, [text(lang)])] : [dots],
  );

  return element('figure', { class: 'code-window', 'data-language': lang || undefined }, [bar, pre]);
}

export default function rehypeCodeWindow() {
  return (tree) => {
    const walk = (node) => {
      if (!node || !Array.isArray(node.children)) return;

      for (let i = 0; i < node.children.length; i += 1) {
        const child = node.children[i];
        const isCodeBlock =
          child?.type === 'element' &&
          child.tagName === 'pre' &&
          (classList(child).includes('astro-code') ||
            child.children?.some((c) => c.type === 'element' && c.tagName === 'code'));

        if (isCodeBlock) {
          node.children[i] = buildWindow(child);
          continue;
        }

        walk(child);
      }
    };

    walk(tree);
  };
}

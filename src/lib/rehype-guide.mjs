/**
 * Plugin rehype (sin dependencias) para las guías en Markdown.
 *
 * Convenciones que habilita (documentadas en el README):
 *  - `## Título {#id}`          → sección con identificador estable (igual en todos los idiomas).
 *  - `### Título {+}`           → acordeón desplegable hasta el siguiente ### / ## / ---.
 *  - `> [!AVISO]`, `> [!NOTA]`, `> [!CONSEJO]`, `> [!IMPORTANTE]` (o sus equivalentes en
 *    inglés `[!WARNING]`, `[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`) → caja de aviso.
 *  - Enlaces externos → se abren en una pestaña nueva.
 *  - Seguridad: se eliminan <script>, <iframe>, <style>, formularios, atributos on* y URLs
 *    javascript:. El Markdown solo controla texto y formato; los bloques especiales se
 *    insertan con {{tokens}} que apuntan a componentes validados.
 *
 * Cada `##` se envuelve en `<section class="guide-section">`, lo que permite construir
 * el índice y la navegación sin JavaScript.
 */

const CALLOUTS = {
  NOTE: 'note',
  NOTA: 'note',
  INFO: 'note',
  TIP: 'tip',
  CONSEJO: 'tip',
  IMPORTANT: 'important',
  IMPORTANTE: 'important',
  WARNING: 'warning',
  AVISO: 'warning',
  CAUTION: 'warning',
};

const ATTRS_RE = /\s*\{\s*([#+][^{}]*)\}\s*$/;

/** @param {any} node */
function isElement(node, ...names) {
  return node?.type === 'element' && (names.length === 0 || names.includes(node.tagName));
}

/** @param {any} node @returns {string} */
function textOf(node) {
  if (!node) return '';
  if (node.type === 'text') return node.value;
  return (node.children ?? []).map(textOf).join('');
}

/** @param {string} value */
function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\{\{[^}]*\}\}/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Lee y elimina `{#id +}` al final de un encabezado. */
function readHeadingAttrs(heading) {
  const last = heading.children.at(-1);
  if (!last || last.type !== 'text') return {};
  const match = last.value.match(ATTRS_RE);
  if (!match) return {};
  last.value = last.value.replace(ATTRS_RE, '');
  const attrs = {};
  for (const token of match[1].trim().split(/\s+/)) {
    if (token.startsWith('#')) attrs.id = token.slice(1);
    if (token === '+') attrs.accordion = true;
  }
  return attrs;
}

/** Elementos que el Markdown no puede insertar: no se permite ejecutar código ni incrustar contenido. */
const BLOCKED = new Set(['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'link', 'meta', 'base']);
const BLOCKED_RAW = /<\s*\/?\s*(script|style|iframe|object|embed|form|link|meta|base)\b|\son\w+\s*=|javascript:/i;

/** Quita elementos peligrosos, atributos `on*` y URLs `javascript:`. Devuelve false si hay que eliminar el nodo. */
function sanitize(node) {
  if (node.type === 'raw') return !BLOCKED_RAW.test(node.value);
  if (!isElement(node)) return true;
  if (BLOCKED.has(node.tagName)) return false;
  for (const key of Object.keys(node.properties ?? {})) {
    const value = String(node.properties[key]);
    if (/^on/i.test(key) || /^\s*javascript:/i.test(value)) delete node.properties[key];
  }
  return true;
}

/** Recorre el árbol: seguridad, atributos de encabezados, avisos y enlaces. */
function visit(node) {
  if (!node.children) return;
  node.children = node.children.filter(sanitize);
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (!isElement(child)) continue;

    if (isElement(child, 'h2', 'h3')) {
      child.data = { ...child.data, guide: readHeadingAttrs(child) };
    }

    if (isElement(child, 'blockquote')) {
      const callout = toCallout(child);
      if (callout) node.children[i] = callout;
    }

    if (isElement(child, 'a') && /^https?:\/\//.test(String(child.properties?.href ?? ''))) {
      child.properties.target = '_blank';
      child.properties.rel = ['noopener', 'noreferrer'];
    }

    visit(node.children[i]);
  }
}

function toCallout(blockquote) {
  const first = blockquote.children.find((c) => isElement(c));
  if (!isElement(first, 'p')) return null;
  const firstText = first.children[0];
  if (!firstText || firstText.type !== 'text') return null;
  const match = firstText.value.match(/^\s*\[!([A-ZÁÉÍÓÚ]+)\]\s*/);
  if (!match) return null;
  const kind = CALLOUTS[match[1]];
  if (!kind) return null;
  firstText.value = firstText.value.slice(match[0].length);
  // Elimina un salto de línea inicial que queda tras el marcador.
  if (firstText.value === '' && isElement(first.children[1], 'br')) first.children.splice(0, 2);
  return {
    type: 'element',
    tagName: 'aside',
    properties: { className: ['callout', `callout-${kind}`], role: 'note' },
    children: blockquote.children,
  };
}

/** `### Título {+}` → <details> con todo lo que sigue hasta el siguiente encabezado. */
function wrapAccordions(children) {
  const out = [];
  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    if (isElement(node, 'h3') && node.data?.guide?.accordion) {
      const body = [];
      while (i + 1 < children.length && !isElement(children[i + 1], 'h1', 'h2', 'h3', 'hr')) {
        body.push(children[++i]);
      }
      out.push({
        type: 'element',
        tagName: 'details',
        properties: { className: ['accordion'] },
        children: [
          { type: 'element', tagName: 'summary', properties: {}, children: [node] },
          { type: 'element', tagName: 'div', properties: { className: ['accordion-body'] }, children: body },
        ],
      });
    } else {
      out.push(node);
    }
  }
  return out;
}

/** Envuelve cada `##` y su contenido en una <section>. */
function wrapSections(children) {
  const out = [];
  let current = null;
  const used = new Set();
  for (const node of children) {
    if (isElement(node, 'h2')) {
      const title = textOf(node).trim();
      let id = node.data?.guide?.id || slugify(title) || 'seccion';
      while (used.has(id)) id += '-2';
      used.add(id);
      node.properties = { ...node.properties, id: `${id}-title` };
      current = {
        type: 'element',
        tagName: 'section',
        properties: {
          className: ['guide-section'],
          id,
          dataSection: id,
          dataTitle: title,
          ariaLabelledby: `${id}-title`,
        },
        children: [node],
      };
      out.push(current);
    } else if (current) {
      current.children.push(node);
    } else {
      out.push(node);
    }
  }
  return out;
}

export default function rehypeGuide() {
  return (tree) => {
    visit(tree);
    tree.children = wrapSections(wrapAccordions(tree.children));
  };
}

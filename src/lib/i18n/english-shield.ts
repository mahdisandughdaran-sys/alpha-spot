import { applyEnglish, hasPersian } from "./apply-en.ts";

const SKIP = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "INPUT"]);
const ATTRS = ["placeholder", "aria-label", "title", "alt"] as const;

const textBase = new WeakMap<Text, string>();
const attrBase = new WeakMap<Element, Partial<Record<(typeof ATTRS)[number], string>>>();

function skipped(node: Node | null): boolean {
  let cur: Node | null = node;
  while (cur) {
    if (cur instanceof Element && SKIP.has(cur.tagName)) return true;
    cur = cur.parentNode;
  }
  return false;
}

function syncText(node: Text, english: boolean) {
  if (skipped(node.parentNode)) return;
  const current = node.nodeValue ?? "";
  let base = textBase.get(node);
  if (base == null) {
    base = current;
    textBase.set(node, base);
  } else if (current !== base && current !== applyEnglish(base)) {
    base = current;
    textBase.set(node, base);
  }
  const next = english ? applyEnglish(base) : base;
  if (node.nodeValue !== next) node.nodeValue = next;
}

function syncAttrs(el: Element, english: boolean) {
  if (skipped(el)) return;
  let saved = attrBase.get(el);
  for (const attr of ATTRS) {
    const current = el.getAttribute(attr);
    if (current == null) continue;
    if (!saved) {
      saved = {};
      attrBase.set(el, saved);
    }
    const prev = saved[attr];
    if (prev == null) saved[attr] = current;
    else if (current !== prev && current !== applyEnglish(prev)) saved[attr] = current;
    const base = saved[attr] ?? current;
    const next = english ? applyEnglish(base) : base;
    if (el.getAttribute(attr) !== next) el.setAttribute(attr, next);
  }
}

function walk(node: Node, english: boolean) {
  if (node instanceof Text) {
    if (english) {
      if (hasPersian(node.nodeValue ?? "") || (node.nodeValue ?? "").includes("٪") || textBase.has(node)) {
        syncText(node, true);
      }
    } else if (textBase.has(node)) {
      syncText(node, false);
    }
    return;
  }
  if (node instanceof Element) {
    if (SKIP.has(node.tagName)) return;
    if (
      english
        ? ATTRS.some((attr) => {
            const v = node.getAttribute(attr);
            return !!v && (hasPersian(v) || v.includes("٪"));
          }) || attrBase.has(node)
        : attrBase.has(node)
    ) {
      syncAttrs(node, english);
    }
    for (const child of node.childNodes) walk(child, english);
  }
}

/** Keep English mode free of Persian script, including copy that never went through tr(). */
export function mountEnglishShield(getEnglish: () => boolean): () => void {
  if (typeof document === "undefined") return () => {};
  let busy = false;
  const run = () => {
    if (busy) return;
    busy = true;
    try {
      walk(document.body, getEnglish());
    } finally {
      busy = false;
    }
  };
  run();
  const observer = new MutationObserver((records) => {
    if (!getEnglish()) return;
    if (busy) return;
    busy = true;
    try {
      for (const record of records) {
        if (record.type === "characterData" && record.target instanceof Text) {
          syncText(record.target, true);
        } else if (record.type === "attributes" && record.target instanceof Element) {
          syncAttrs(record.target, true);
        } else {
          record.addedNodes.forEach((node) => walk(node, true));
        }
      }
    } finally {
      busy = false;
    }
  });
  observer.observe(document.body, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: [...ATTRS],
  });
  return () => observer.disconnect();
}

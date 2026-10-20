"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { Trash } from "@/components/ui/icons";
import { HIGHLIGHT_COLORS, type HighlightColor, type ReadingStore, type TextHighlight } from "@/lib/reading/storage";

const SWATCH: Record<HighlightColor, string> = {
  yellow: "#facc15",
  green: "#4ade80",
  blue: "#60a5fa",
  pink: "#f472b6",
};

type Menu =
  | { mode: "new"; rect: DOMRect; start: number; end: number }
  | { mode: "existing"; rect: DOMRect; id: string };

const supported = () => typeof CSS !== "undefined" && "highlights" in CSS;

/** Paint colours. Injected at runtime because the CSS build pipeline drops `::highlight()` rules. */
const PAINT: Record<HighlightColor, string> = {
  yellow: "rgba(250, 204, 21, 0.4)",
  green: "rgba(74, 222, 128, 0.35)",
  blue: "rgba(96, 165, 250, 0.38)",
  pink: "rgba(244, 114, 182, 0.38)",
};

function ensurePaintStyles() {
  if (document.getElementById("reader-highlight-styles")) return;
  const style = document.createElement("style");
  style.id = "reader-highlight-styles";
  style.textContent = HIGHLIGHT_COLORS.map((c) => `::highlight(hl-${c}) { background-color: ${PAINT[c]}; }`).join(" ");
  document.head.appendChild(style);
}

/** Character offset of (node, offset) from the start of `root`'s text. */
function textOffset(root: Node, node: Node, offset: number): number {
  const r = document.createRange();
  r.setStart(root, 0);
  r.setEnd(node, offset);
  return r.toString().length;
}

/** The DOM range covering characters [start, end) of `root`'s text, or null if out of bounds. */
function rangeFromOffsets(root: Node, start: number, end: number): Range | null {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let pos = 0;
  let startNode: Text | null = null;
  let startOffset = 0;
  for (let n = walker.nextNode() as Text | null; n; n = walker.nextNode() as Text | null) {
    const len = n.data.length;
    if (!startNode && start < pos + len) {
      startNode = n;
      startOffset = start - pos;
    }
    if (startNode && end <= pos + len) {
      const r = document.createRange();
      r.setStart(startNode, startOffset);
      r.setEnd(n, end - pos);
      return r;
    }
    pos += len;
  }
  return null;
}

/** Re-find a saved highlight. Falls back to searching for its text nearest the old offset if the chapter changed. */
function resolve(root: HTMLElement, h: TextHighlight): { range: Range; start: number; end: number } | null {
  const direct = rangeFromOffsets(root, h.start, h.end);
  if (direct && direct.toString() === h.text) return { range: direct, start: h.start, end: h.end };
  const full = root.textContent ?? "";
  let best = -1;
  for (let i = full.indexOf(h.text); i !== -1; i = full.indexOf(h.text, i + 1)) {
    if (best === -1 || Math.abs(i - h.start) < Math.abs(best - h.start)) best = i;
  }
  if (best === -1) return null;
  const range = rangeFromOffsets(root, best, best + h.text.length);
  return range ? { range, start: best, end: best + h.text.length } : null;
}

function caretAt(x: number, y: number): { node: Node; offset: number } | null {
  if (document.caretPositionFromPoint) {
    const p = document.caretPositionFromPoint(x, y);
    return p ? { node: p.offsetNode, offset: p.offset } : null;
  }
  const r = document.caretRangeFromPoint?.(x, y);
  return r ? { node: r.startContainer, offset: r.startOffset } : null;
}

/**
 * Persistent text highlighting for a chapter. Select text inside `articleRef` to get a
 * colour bar; click a highlight to recolour or remove it. Highlights are painted with the
 * CSS Custom Highlight API, so the server-rendered chapter DOM is never modified.
 */
export function Highlighter({
  store,
  book,
  slug,
  articleRef,
}: {
  store: ReadingStore;
  book: string;
  slug: string;
  articleRef: RefObject<HTMLElement | null>;
}) {
  const [highlights, setHighlights] = useState<TextHighlight[]>([]);
  const [menu, setMenu] = useState<Menu | null>(null);
  const ranges = useRef(new Map<string, Range>());

  // Load this chapter's highlights.
  useEffect(() => {
    if (!supported()) return;
    const id = window.setTimeout(() => setHighlights(store.getHighlights(book, slug)), 0);
    return () => window.clearTimeout(id);
  }, [store, book, slug]);

  // Paint them.
  useEffect(() => {
    const root = articleRef.current;
    if (!root || !supported()) return;
    ensurePaintStyles();
    const groups = new Map<HighlightColor, Range[]>();
    ranges.current.clear();
    for (const h of highlights) {
      const found = resolve(root, h);
      if (!found) continue;
      ranges.current.set(h.id, found.range);
      groups.set(h.color, [...(groups.get(h.color) ?? []), found.range]);
    }
    for (const color of HIGHLIGHT_COLORS) {
      const list = groups.get(color);
      if (list) CSS.highlights.set(`hl-${color}`, new Highlight(...list));
      else CSS.highlights.delete(`hl-${color}`);
    }
  }, [highlights, articleRef]);

  useEffect(
    () => () => {
      if (supported()) for (const color of HIGHLIGHT_COLORS) CSS.highlights.delete(`hl-${color}`);
    },
    [],
  );

  const save = useCallback(
    (next: TextHighlight[]) => {
      setHighlights(next);
      store.setHighlights(book, slug, next);
    },
    [store, book, slug],
  );

  // Show the colour bar for a fresh selection inside the chapter.
  useEffect(() => {
    if (!supported()) return;
    let timer = 0;
    const onSelection = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const root = articleRef.current;
        const sel = window.getSelection();
        if (!root || !sel || sel.rangeCount === 0 || sel.isCollapsed) {
          setMenu((m) => (m?.mode === "new" ? null : m));
          return;
        }
        const range = sel.getRangeAt(0);
        if (!root.contains(range.startContainer) || !root.contains(range.endContainer) || !range.toString().trim()) {
          setMenu((m) => (m?.mode === "new" ? null : m));
          return;
        }
        setMenu({
          mode: "new",
          rect: range.getBoundingClientRect(),
          start: textOffset(root, range.startContainer, range.startOffset),
          end: textOffset(root, range.endContainer, range.endOffset),
        });
      }, 200);
    };
    document.addEventListener("selectionchange", onSelection);
    return () => {
      document.removeEventListener("selectionchange", onSelection);
      window.clearTimeout(timer);
    };
  }, [articleRef]);

  // Clicking a highlight opens its menu.
  useEffect(() => {
    const root = articleRef.current;
    if (!root || !supported()) return;
    const onClick = (e: MouseEvent) => {
      if (!window.getSelection()?.isCollapsed) return;
      const caret = caretAt(e.clientX, e.clientY);
      if (!caret) return;
      for (const [id, range] of ranges.current) {
        if (range.isPointInRange(caret.node, caret.offset)) {
          const rects = [...range.getClientRects()];
          const rect = rects.find((r) => e.clientY >= r.top && e.clientY <= r.bottom) ?? range.getBoundingClientRect();
          setMenu({ mode: "existing", rect, id });
          return;
        }
      }
    };
    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, [articleRef]);

  // Close on scroll, resize, Escape, or a click elsewhere.
  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const onPointer = (e: PointerEvent) => {
      if (!(e.target as Element).closest?.("[data-highlight-menu]") && menu.mode === "existing") close();
    };
    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("resize", close);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("scroll", close);
      window.removeEventListener("resize", close);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [menu]);

  if (!menu) return null;

  const add = (color: HighlightColor) => {
    const root = articleRef.current;
    if (!root || menu.mode !== "new") return;
    // Merge with any highlight it overlaps, so passages never stack.
    const overlapping = highlights.filter((h) => h.start < menu.end && menu.start < h.end);
    const start = Math.min(menu.start, ...overlapping.map((h) => h.start));
    const end = Math.max(menu.end, ...overlapping.map((h) => h.end));
    const text = rangeFromOffsets(root, start, end)?.toString() ?? "";
    const rest = highlights.filter((h) => !overlapping.includes(h));
    save([...rest, { id: crypto.randomUUID(), start, end, text, color }]);
    window.getSelection()?.removeAllRanges();
    setMenu(null);
  };

  const recolor = (color: HighlightColor) => {
    if (menu.mode !== "existing") return;
    save(highlights.map((h) => (h.id === menu.id ? { ...h, color } : h)));
    setMenu(null);
  };

  const remove = () => {
    if (menu.mode !== "existing") return;
    save(highlights.filter((h) => h.id !== menu.id));
    setMenu(null);
  };

  const current = menu.mode === "existing" ? highlights.find((h) => h.id === menu.id)?.color : undefined;
  const below =
    menu.rect.top < 64 || (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches);
  const top = below ? menu.rect.bottom + 10 : menu.rect.top - 50;
  const left = Math.min(Math.max(menu.rect.left + menu.rect.width / 2, 110), window.innerWidth - 110);

  return (
    <div
      data-highlight-menu
      role="toolbar"
      aria-label={menu.mode === "new" ? "Highlight selection" : "Edit highlight"}
      className="fixed z-50 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-line bg-bg-2 px-2 py-1.5 shadow-xl"
      style={{ top, left }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {HIGHLIGHT_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => (menu.mode === "new" ? add(color) : recolor(color))}
          className={`h-6 w-6 rounded-full border-2 transition hover:scale-110 ${
            current === color ? "border-fg" : "border-transparent"
          }`}
          style={{ background: SWATCH[color] }}
          aria-label={`Highlight ${color}`}
          aria-pressed={current === color}
        />
      ))}
      {menu.mode === "existing" && (
        <button
          type="button"
          onClick={remove}
          className="ml-1 flex items-center gap-1 rounded-full border-l border-line pl-2 pr-1 text-xs text-fg-muted hover:text-fg"
          aria-label="Remove highlight"
        >
          <Trash size={14} /> Remove
        </button>
      )}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Tracks whether the chrome should be visible. It hides after `delay` ms of inactivity
 * unless `paused` (a panel is open, the pointer is over the toolbar, ...).
 */
export function useAutoHide(delay: number, paused: boolean) {
  const [visible, setVisible] = useState(true);
  const timer = useRef<number | null>(null);
  const pausedRef = useRef(paused);

  const clear = useCallback(() => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const arm = useCallback(() => {
    clear();
    if (!pausedRef.current) timer.current = window.setTimeout(() => setVisible(false), delay);
  }, [clear, delay]);

  // Any activity shows the chrome and restarts the countdown.
  const poke = useCallback(() => {
    setVisible(true);
    arm();
  }, [arm]);

  const hide = useCallback(() => {
    clear();
    setVisible(false);
  }, [clear]);

  useEffect(() => {
    pausedRef.current = paused;
    if (paused) clear();
    else arm();
    return clear;
  }, [paused, arm, clear]);

  return { visible: visible || paused, poke, hide };
}

export interface Size {
  width: number;
  height: number;
}

/** Observes an element's content box. */
export function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setSize((prev) =>
        Math.abs(prev.width - rect.width) < 0.5 && Math.abs(prev.height - rect.height) < 0.5
          ? prev
          : { width: rect.width, height: rect.height },
      );
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, size] as const;
}

/** Returns a value that only updates after it has been stable for `delay` ms. */
export function useDebounced<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

/** Fullscreen state for an element, kept in sync with the browser. */
export function useFullscreen(target: React.RefObject<HTMLElement | null>) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const sync = () => setActive(document.fullscreenElement === target.current && !!target.current);
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, [target]);

  const toggle = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await target.current?.requestFullscreen();
    } catch {
      /* fullscreen not permitted */
    }
  }, [target]);

  return { active, toggle };
}

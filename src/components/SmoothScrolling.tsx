'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from '@studio-freight/lenis';

export default function SmoothScrolling() {
  const pathname = usePathname();

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = window.matchMedia('(any-hover: hover) and (any-pointer: fine)');
    let lenis: Lenis | undefined;
    let frame = 0;

    const tick = (time: number) => {
      lenis?.raf(time);
      frame = requestAnimationFrame(tick);
    };
    const syncVisibility = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (!lenis) return;
      if (document.hidden || document.body.style.overflow === 'hidden') lenis.stop();
      else { lenis.start(); frame = requestAnimationFrame(tick); }
    };
    const configure = () => {
      cancelAnimationFrame(frame);
      lenis?.destroy();
      lenis = undefined;
      if (!motion.matches && pointer.matches) {
        lenis = new Lenis({ lerp: 0.085, smoothWheel: true, syncTouch: false });
        syncVisibility();
      }
    };
    const onAnchor = (event: MouseEvent) => {
      if (!lenis || lenis.isStopped || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest('a') : null;
      if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || !url.hash) return;
      let target: HTMLElement | null;
      try { target = document.getElementById(decodeURIComponent(url.hash.slice(1))); } catch { return; }
      if (!target) return;
      event.preventDefault();
      const offset = -(parseFloat(getComputedStyle(target).scrollMarginTop) || 0);
      history.pushState(null, '', url.hash);
      lenis.scrollTo(target, { offset, onComplete: () => {
        const addedTabIndex = !target.hasAttribute('tabindex');
        if (addedTabIndex) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        if (addedTabIndex) target.removeAttribute('tabindex');
      } });
    };
    const observer = new MutationObserver(syncVisibility);
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    configure();
    motion.addEventListener('change', configure);
    pointer.addEventListener('change', configure);
    document.addEventListener('visibilitychange', syncVisibility);
    document.addEventListener('click', onAnchor, true);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      lenis?.destroy();
      motion.removeEventListener('change', configure);
      pointer.removeEventListener('change', configure);
      document.removeEventListener('visibilitychange', syncVisibility);
      document.removeEventListener('click', onAnchor, true);
    };
  }, [pathname]);

  return null;
}

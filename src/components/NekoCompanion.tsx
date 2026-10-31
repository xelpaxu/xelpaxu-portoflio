'use client';

import { useEffect, useRef } from 'react';
import { createNeko, NEKO_SIZE, parkNeko, resizeNeko, stepNeko, targetNeko } from '@/lib/neko';

export default function NekoCompanion() {
  const sprite = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = sprite.current;
    if (!element) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = window.matchMedia('(any-hover: hover) and (any-pointer: fine)');
    const cat = createNeko(window.innerWidth, window.innerHeight, performance.now());
    let enabled = true;
    let frame = 0;
    let lastTime = 0;
    let previousCell = '';
    let previousPosition = '';
    let disposed = false;
    const image = new window.Image();
    let imageReady = false;
    let hasFollowedPointer = false;

    function placeBesideProfile() {
      if (hasFollowedPointer) return;
      const anchor = document.querySelector('[data-neko-home]');
      if (!anchor) return;
      const bounds = anchor.getBoundingClientRect();
      if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
      cat.x = bounds.right + 8 + NEKO_SIZE / 2;
      cat.y = bounds.bottom - NEKO_SIZE / 2;
      resizeNeko(cat, window.innerWidth, window.innerHeight);
      parkNeko(cat, performance.now());
    }
    placeBesideProfile();

    const canAnimate = () => enabled && imageReady && !motion.matches && pointer.matches && !document.hidden;
    function animate(now: number) {
      if (!canAnimate() || disposed) { frame = 0; return; }
      // Match the classic desktop pet: discrete movement and sprite changes at 10 fps.
      if (lastTime && now - lastTime < 100) { frame = requestAnimationFrame(animate); return; }
      const delta = lastTime ? (now - lastTime) / 1000 : 0;
      lastTime = now;
      const cell = stepNeko(cat, now, delta);
      const nextCell = `${-cell[0] * NEKO_SIZE}px ${-cell[1] * NEKO_SIZE}px`;
      if (nextCell !== previousCell) { element!.style.backgroundPosition = nextCell; previousCell = nextCell; }
      const position = `translate3d(${Math.round(cat.x - NEKO_SIZE / 2)}px, ${Math.round(cat.y - NEKO_SIZE / 2)}px, 0)`;
      if (position !== previousPosition) { element!.style.transform = position; previousPosition = position; }
      if (element!.dataset.pose !== cat.pose) element!.dataset.pose = cat.pose;
      frame = requestAnimationFrame(animate);
    }
    function sync() {
      cancelAnimationFrame(frame); frame = 0; lastTime = 0;
      const active = canAnimate();
      element!.style.display = active ? 'block' : 'none';
      if (active && !disposed) frame = requestAnimationFrame(animate);
    }
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !canAnimate()) return;
      hasFollowedPointer = true;
      targetNeko(cat, event.clientX, event.clientY, window.innerWidth, window.innerHeight, performance.now());
    };
    const onLeave = () => parkNeko(cat, performance.now());
    const onResize = () => { resizeNeko(cat, window.innerWidth, window.innerHeight); placeBesideProfile(); };
    const onVisibility = () => { parkNeko(cat, performance.now()); sync(); };
    const onPreference = (event: Event) => {
      const detail = (event as CustomEvent<boolean>).detail;
      if (typeof detail === 'boolean') enabled = detail;
      sync();
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'portfolio-neko' || event.key === null) { enabled = event.newValue !== 'off'; sync(); }
    };
    try { enabled = localStorage.getItem('portfolio-neko') !== 'off'; } catch { /* Optional persistence. */ }
    image.onload = () => { if (!disposed) { imageReady = true; placeBesideProfile(); sync(); } };
    image.src = '/assets/neko/neko.png';
    sync();
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);
    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('portfolio-neko-change', onPreference);
    window.addEventListener('storage', onStorage);
    motion.addEventListener('change', sync);
    pointer.addEventListener('change', sync);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      image.onload = null;
      window.removeEventListener('pointermove', onPointer);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('portfolio-neko-change', onPreference);
      window.removeEventListener('storage', onStorage);
      motion.removeEventListener('change', sync);
      pointer.removeEventListener('change', sync);
    };
  }, []);

  return <div ref={sprite} id="neko-companion" aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[90] hidden select-none" style={{ width: NEKO_SIZE, height: NEKO_SIZE, backgroundImage: 'url(/assets/neko/neko.png)', backgroundSize: `${NEKO_SIZE * 8}px ${NEKO_SIZE * 4}px`, backgroundRepeat: 'no-repeat', imageRendering: 'pixelated', willChange: 'transform', filter: 'drop-shadow(0 1px 1px rgb(0 0 0 / 25%))' }} />;
}

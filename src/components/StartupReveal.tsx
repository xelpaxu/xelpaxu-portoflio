'use client';

import { useEffect, useRef } from 'react';

// A dissolving veil leaves the actual page layout and interactions untouched.
export default function StartupReveal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const context = canvas.getContext('2d');
    if (motion.matches || !context) { canvas.hidden = true; return; }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.scale(ratio, ratio);
    const styles = getComputedStyle(document.documentElement);
    const background = styles.getPropertyValue('--page').trim();
    const dust = styles.getPropertyValue('--subtle').trim();
    const size = width < 640 ? 10 : 12;
    const sweepDuration = 2400;
    const tileDuration = 800;
    const stagger = 280;
    const cells: { x: number; y: number; start: number; drift: number; lift: number; speck: number }[] = [];
    for (let y = 0; y < height; y += size) {
      for (let x = 0; x < width; x += size) {
        cells.push({ x, y, start: (y / height) * sweepDuration + Math.random() * stagger,
          drift: 12 + Math.random() * 36, lift: 8 + Math.random() * 24,
          speck: 1 + Math.random() * 2 });
      }
    }
    let frame = 0;
    let start: number | undefined;
    const finish = () => { cancelAnimationFrame(frame); canvas.hidden = true; };
    const draw = (now: number) => {
      start ??= now;
      const elapsed = now - start;
      context.clearRect(0, 0, width, height);
      for (const cell of cells) {
        const progress = Math.max(0, Math.min(1, (elapsed - cell.start) / tileDuration));
        if (progress === 1) continue;
        context.fillStyle = background;
        context.globalAlpha = 1 - progress * progress * (3 - 2 * progress);
        const remaining = size * (1 - progress);
        context.fillRect(cell.x + progress * cell.drift, cell.y - progress * cell.lift, remaining + 0.5, remaining + 0.5);
        if (progress > 0) {
          context.fillStyle = dust;
          context.globalAlpha = Math.sin(progress * Math.PI) * 0.35;
          context.fillRect(cell.x + progress * cell.drift * 1.8, cell.y - progress * cell.lift * 1.5, cell.speck, cell.speck);
        }
      }
      context.globalAlpha = 1;
      canvas.style.background = 'transparent';
      if (elapsed < sweepDuration + stagger + tileDuration) frame = requestAnimationFrame(draw);
      else finish();
    };
    frame = requestAnimationFrame(draw);
    motion.addEventListener('change', finish);
    window.addEventListener('resize', finish, { once: true });
    window.addEventListener('pointerdown', finish, { once: true });
    window.addEventListener('keydown', finish, { once: true });
    return () => {
      cancelAnimationFrame(frame);
      motion.removeEventListener('change', finish);
      window.removeEventListener('resize', finish);
      window.removeEventListener('pointerdown', finish);
      window.removeEventListener('keydown', finish);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="startup-reveal" />;
}

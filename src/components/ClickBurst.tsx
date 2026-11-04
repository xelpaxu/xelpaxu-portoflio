'use client';

import { useEffect } from 'react';

// Length and thickness are in globals.css under .cursor-click-burst i.
const BURST_ANGLES = [135, 180, 225, 270, 315];
const BURST_SPACING = 4;
const BURST_TRAVEL = 13;
const BURST_DURATION = 420;

export default function ClickBurst() {
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const nodes = new Set<HTMLElement>();
    const onClick = (event: MouseEvent) => {
      if (motion.matches || event.detail === 0) return;
      const node = document.createElement('span');
      node.className = 'cursor-click-burst';
      node.setAttribute('aria-hidden', 'true');
      node.style.left = `${event.clientX}px`;
      node.style.top = `${event.clientY}px`;
      for (const angle of BURST_ANGLES) {
        const ray = document.createElement('i');
        node.appendChild(ray);
        const animation = ray.animate([
          { transform: `rotate(${angle}deg) translateX(${BURST_SPACING}px) scaleX(1)`, opacity: 1 },
          { transform: `rotate(${angle}deg) translateX(${BURST_TRAVEL}px) scaleX(.3)`, opacity: 0 },
        ], { duration: BURST_DURATION, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' });
        if (angle === BURST_ANGLES[0]) {
          animation.onfinish = () => { node.remove(); nodes.delete(node); };
        }
      }
      document.body.appendChild(node);
      nodes.add(node);
    };
    window.addEventListener('click', onClick, { passive: true });
    return () => { window.removeEventListener('click', onClick); nodes.forEach(node => node.remove()); };
  }, []);
  return null;
}

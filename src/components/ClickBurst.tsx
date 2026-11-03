'use client';

import { useEffect } from 'react';

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
      for (const angle of [-180, -135, -90, -45]) {
        const ray = document.createElement('i');
        ray.style.transform = `rotate(${angle}deg)`;
        node.appendChild(ray);
      }
      document.body.appendChild(node);
      nodes.add(node);
      const animation = node.animate([
        { opacity: 0.75, transform: 'scale(.45)' },
        { opacity: 0, transform: 'scale(1.4)' },
      ], { duration: 300, easing: 'cubic-bezier(.15,.7,.3,1)' });
      animation.onfinish = () => { node.remove(); nodes.delete(node); };
    };
    window.addEventListener('click', onClick, { passive: true });
    return () => { window.removeEventListener('click', onClick); nodes.forEach(node => node.remove()); };
  }, []);
  return null;
}

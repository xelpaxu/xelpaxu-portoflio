'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { Heart } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';

export default function PortraitCelebration() {
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.portraitCelebration = 'pink';
    const frame = requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      delete root.dataset.portraitCelebration;
      setVisible(false);
    }, 5000);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      delete root.dataset.portraitCelebration;
    };
  }, []);

  if (!visible) return null;
  return createPortal(<div className="portrait-hearts" aria-hidden="true">
    {Array.from({ length: reducedMotion ? 6 : 22 }, (_, index) => <Heart key={index}
      className={reducedMotion ? 'portrait-heart portrait-heart-still' : 'portrait-heart'}
      style={{
        left: `${(index * 37 + 7) % 100}%`,
        top: reducedMotion ? `${15 + (index * 17) % 70}%` : undefined,
        width: 16 + index % 4 * 7,
        height: 16 + index % 4 * 7,
        animationDelay: `${index % 7 * 0.18}s`,
        animationDuration: `${3.3 + index % 4 * 0.25}s`,
        '--heart-drift': `${(index % 2 ? 1 : -1) * (25 + index % 5 * 12)}px`,
      } as CSSProperties} />)}
  </div>, document.body);
}

'use client';

import { motion, useReducedMotion, useSpring } from 'framer-motion';
import type { PointerEvent, ReactNode } from 'react';

export default function InteractiveStackLogo({ children, preferred }: { children: ReactNode; preferred: boolean }) {
  const reducedMotion = useReducedMotion();
  const rotateX = useSpring(0, { stiffness: 300, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 20 });
  const lift = useSpring(0, { stiffness: 300, damping: 20 });

  function reset() { rotateX.set(0); rotateY.set(0); lift.set(0); }
  function follow(event: PointerEvent<HTMLSpanElement>) {
    if (reducedMotion || event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    rotateX.set(-y * 20);
    rotateY.set(x * 24);
    lift.set(-4);
  }

  return <span className="stack-logo-interaction" onPointerMove={follow}
    onPointerLeave={reset} onPointerCancel={reset} onPointerUp={reset}>
    <motion.span className="stack-logo-depth" style={reducedMotion ? undefined : { rotateX, rotateY, y: lift }}
      whileTap={reducedMotion ? undefined : { scale: 0.9 }}>
      <span className="stack-logo-art">{children}</span>
      {preferred && <svg aria-hidden="true" className="stack-go-to-circle" viewBox="0 0 84 70" fill="none">
        <motion.path d="M68 13C51 3 22 5 11 22C-1 40 13 60 36 62C62 65 83 49 76 28C72 14 51 5 30 9C12 12 4 28 10 42C16 57 39 64 58 57"
          stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"
          variants={reducedMotion ? undefined : {
            hidden: { pathLength: 0, opacity: 0 },
            visible: { pathLength: 1, opacity: 1, transition: { duration: 0.4, delay: 0.08 } },
            exit: { opacity: 0, transition: { duration: 0.08 } },
          }} />
      </svg>}
    </motion.span>
  </span>;
}

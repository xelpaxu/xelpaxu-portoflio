'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const PHOTOS: { src: string; caption: string }[] = [
  { src: '/assets/img1.jpg', caption: 'cebu trip w/her' },
  { src: '/assets/img2.jpg', caption: 'bucket list checked w/her' },
  { src: '/assets/img3.jpg', caption: 'yeyy skatinggg' },
  { src: '/assets/img4.jpg', caption: 'us cutieee' },
];

const SLIDES = [...PHOTOS, ...PHOTOS];
const STEP = 9;
const SPRING = { type: 'spring', stiffness: 170, damping: 22 } as const;

export default function PhotoFan() {
  const reducedMotion = useReducedMotion();
  const [order, setOrder] = useState(() => SLIDES.map((_, index) => index));
  const [flying, setFlying] = useState<null | { id: number; dir: 1 | -1 }>(null);
  const dragging = useRef(false);

  const total = SLIDES.length;
  const offsetOf = (id: number) => {
    const rel = order.indexOf(id);
    return rel < total / 2 ? rel : rel - total;
  };
  const front = order[0] % PHOTOS.length;

  const shuffle = (dir: 1 | -1) => {
    if (flying) return;
    const frontId = order[0];
    if (reducedMotion) {
      setOrder(previous => [...previous.slice(1), previous[0]]);
      return;
    }
    setFlying({ id: frontId, dir });
    setTimeout(() => {
      setFlying(null);
      setOrder(previous => [...previous.slice(1), previous[0]]);
    }, 300);
  };

  const bringToFront = (id: number) => {
    if (flying || id === order[0]) return;
    const at = order.indexOf(id);
    setOrder(previous => [...previous.slice(at), ...previous.slice(0, at)]);
  };

  const caption = PHOTOS[front]?.caption ?? 'good times';

  return (
    <div className="relative">
      <div className="relative h-[420px] w-full sm:h-[480px]">
        <div className="absolute inset-0 origin-bottom scale-[0.68] min-[420px]:scale-[0.78] sm:scale-[0.88] lg:scale-100">
          {SLIDES.map((photo, id) => {
            const isFlying = flying?.id === id;
            const offset = isFlying ? flying.dir * 7 : offsetOf(id);
            const visual = Math.max(-3, Math.min(3, offset));
            const isFront = id === order[0] && !isFlying;
            return (
              <motion.button
                key={id}
                type="button"
                aria-label={isFront ? 'Current photo' : `Show photo: ${photo.caption}`}
                onClick={() => { if (dragging.current) return; if (isFront) shuffle(1); else bringToFront(id); }}
                onDragStart={() => { dragging.current = true; }}
                onDragEnd={(_, info) => {
                  const moved = Math.abs(info.offset.x);
                  if (moved > 60) shuffle(info.offset.x > 0 ? 1 : -1);
                  setTimeout(() => { dragging.current = false; });
                }}
                drag={isFront && !reducedMotion}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.42}
                dragSnapToOrigin
                dragMomentum={false}
                whileHover={!isFront && !flying ? { scale: 1.03 } : undefined}
                className={`absolute left-1/2 top-[56%] -ml-[95px] -mt-[134px] block h-[268px] w-[190px] overflow-hidden rounded-[26px] border border-line bg-surface shadow-[0_18px_44px_rgba(0,0,0,0.3)] ${isFront ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}`}
                style={{ transformOrigin: '50% 390px', zIndex: 30 - Math.abs(offset) }}
                initial={false}
                animate={isFlying
                  ? { rotate: flying.dir * 58, y: 120, opacity: 0, transition: { duration: 0.3, ease: [0.32, 0, 0.67, 0] } }
                  : { rotate: visual * STEP, x: 0, y: 0, opacity: 1, transition: reducedMotion ? { duration: 0 } : SPRING }}
              >
                <Image src={photo.src} alt={photo.caption} fill sizes="200px" className="object-cover" draggable={false} />
              </motion.button>
            );
          })}

          <div className="pointer-events-none absolute left-1/2 z-50 flex -translate-x-1/2 flex-col items-center" style={{ top: 'calc(56% - 200px)' }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={front}
                className="flex flex-col items-center text-accent"
                initial={{ opacity: 0, y: reducedMotion ? 0 : -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reducedMotion ? 0 : -10 }}
                transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 24 }}
              >
                <motion.div
                  className="rounded-2xl border border-line bg-background/90 px-3.5 py-1.5 shadow-sm"
                  animate={reducedMotion ? undefined : { y: [0, -5, 0], rotate: [-1.5, 1, -1.5] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <span className="text-sm leading-5" style={{ fontFamily: "'Comic Sans MS', 'Segoe Print', cursive" }}>{caption}</span>
                </motion.div>
                <svg aria-hidden="true" width="28" height="26" viewBox="0 0 28 26" fill="none" className="mt-0.5">
                  <path d="M15 2 C 9 10, 21 13, 13 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M7 17 L 13 23 L 19 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-center gap-2" aria-hidden="true">
        {PHOTOS.map((photo, index) => (
          <span key={photo.src} className={`h-1.5 rounded-full transition-all duration-300 ${index === front ? 'w-6 bg-foreground/50' : 'size-1.5 bg-line-strong'}`} />
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-subtle">Click the stack to shuffle</p>
    </div>
  );
}

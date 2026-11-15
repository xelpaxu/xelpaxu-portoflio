'use client';

import Image from 'next/image';
import { useEffect, useId, useRef, useState, type PointerEvent } from 'react';
import { animate, AnimatePresence, motion, useAnimationControls, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { heroPortrait } from '@/data/hero-portrait';
import PortraitCelebration from '@/components/PortraitCelebration';

export default function HeroPortrait({ pokes }: { pokes: number }) {
  const [flipped, setFlipped] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [celebration, setCelebration] = useState(0);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const bubbleId = useId();
  const reducedMotion = useReducedMotion();
  const wobble = useAnimationControls();
  const peel = useMotionValue(0);
  const smoothPeel = useSpring(peel, { stiffness: 220, damping: 32, mass: 0.8 });
  const visiblePeel = reducedMotion ? peel : smoothPeel;
  const drag = useRef<{ x: number; y: number; progress: number; size: number; pointer: number } | null>(null);
  const animation = useRef<{ stop: () => void } | null>(null);
  const revealed = useRef(false);
  const foldId = useId();
  const frontClip = useTransform(visiblePeel, value => {
    const edge = 100 - value * 200;
    return edge >= 0
      ? `polygon(0% 0%, ${edge}% 0%, 100% ${100 - edge}%, 100% 100%, 0% 100%)`
      : `polygon(0% ${-edge}%, 0% ${-edge}%, ${100 + edge}% 100%, ${100 + edge}% 100%, 0% 100%)`;
  });
  const foldPoints = useTransform(visiblePeel, value => {
    const edge = 100 - value * 200;
    return edge >= 0 ? `${edge},0 ${edge},${100 - edge} 100,${100 - edge}` : `0,${-edge} 0,100 ${100 + edge},100`;
  });

  function settle(reveal: boolean) {
    animation.current?.stop();
    setFlipped(reveal);
    setBubbleVisible(false);
    animation.current = animate(peel, reveal ? 1 : 0, {
      duration: reducedMotion ? 0 : 0.85,
      ease: [0.32, 0, 0.2, 1],
      onComplete: () => {
        setBubbleVisible(reveal);
        if (reveal && !revealed.current) setCelebration(value => value + 1);
        revealed.current = reveal;
      },
    });
  }

  useEffect(() => () => animation.current?.stop(), []);

  function startDrag(event: PointerEvent<HTMLButtonElement>) {
    if (event.button !== 0 || !event.isPrimary) return;
    animation.current?.stop();
    const bounds = event.currentTarget.getBoundingClientRect();
    drag.current = { x: event.clientX, y: event.clientY, progress: peel.get(), size: bounds.width, pointer: event.pointerId };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    setBubbleVisible(false);
  }

  function moveDrag(event: PointerEvent<HTMLButtonElement>) {
    const start = drag.current;
    if (!start || start.pointer !== event.pointerId) return;
    const distance = (event.clientY - start.y) - (event.clientX - start.x);
    peel.set(Math.max(0, Math.min(1, start.progress + distance / (start.size * 2.3))));
  }

  function endDrag(event: PointerEvent<HTMLButtonElement>, cancelled = false) {
    if (!drag.current || drag.current.pointer !== event.pointerId) return;
    drag.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    settle(cancelled ? flipped : peel.get() >= 0.55);
  }

  useEffect(() => {
    if (!pokes || reducedMotion) return;
    wobble.stop();
    void wobble.start({
      rotate: [0, -10, 8, -5, 3, 0],
      transition: { duration: 0.6, ease: 'easeOut' },
    });
  }, [pokes, reducedMotion, wobble]);

  return <span className="relative block size-24">
    <button type="button" aria-label={flipped
      ? 'Drag up and right to cover the photo, or press Enter to restore the portrait'
      : 'Drag down and left to peel the portrait, or press Enter to reveal the photo'} aria-pressed={flipped}
    aria-describedby={bubbleVisible && heroPortrait.bubbleText ? bubbleId : undefined}
    title={flipped ? 'Drag up and right to put the sticker back' : 'Drag down and left to peel the sticker'}
    onPointerDown={startDrag} onPointerMove={moveDrag}
    onPointerUp={event => endDrag(event)} onPointerCancel={event => endDrag(event, true)}
    onLostPointerCapture={event => endDrag(event, true)}
    onClick={event => { if (event.detail === 0) settle(!flipped); }}
    className={`relative block size-24 shrink-0 touch-none select-none rounded-full ring-1 ring-line ring-offset-4 ring-offset-page hover:ring-line-strong focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-accent ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
    onDragStart={event => event.preventDefault()}
    >
    <motion.span className="absolute inset-0 overflow-hidden rounded-full" animate={wobble} style={{ transformOrigin: '50% 75%' }} aria-hidden="true">
      <Image src={heroPortrait.back.src} alt="" fill sizes="96px" className="pointer-events-none object-cover" loading="eager" unoptimized draggable={false} />
      <motion.span className="absolute inset-0" style={{ clipPath: frontClip }}>
        <Image src={heroPortrait.front.src} alt="" fill sizes="96px" className="pointer-events-none object-cover" quality={90} priority draggable={false} />
      </motion.span>
      <svg className="portrait-peel-fold" viewBox="0 0 100 100" aria-hidden="true">
        <defs><linearGradient id={foldId} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#fdfbf3" /><stop offset="65%" stopColor="#e9e4d9" />
          <stop offset="100%" stopColor="#aaa597" />
        </linearGradient></defs>
        <motion.polygon points={foldPoints} fill={`url(#${foldId})`} />
      </svg>
    </motion.span>
    <span className="sr-only">{flipped ? `${heroPortrait.back.description}. Activate to show the front photo.` : `${heroPortrait.front.description}. Activate to show the reverse photo.`}</span>
    </button>
    <span className="portrait-drag-hint" aria-hidden="true">{flipped ? 'Drag to cover' : 'Drag to peel'}</span>
    {celebration > 0 && <PortraitCelebration key={celebration} />}
    <AnimatePresence>
      {flipped && bubbleVisible && heroPortrait.bubbleText && <motion.span id={bubbleId} role="status" className="portrait-note"
        initial={reducedMotion ? false : { opacity: 0, scale: 0.85, y: 8, rotate: -7 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotate: -3 }}
        exit={{ opacity: 0, transition: { duration: reducedMotion ? 0 : 0.1 } }}
        transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 350, damping: 22 }}>
        {heroPortrait.bubbleText}
        <svg aria-hidden="true" viewBox="0 0 80 40" className="portrait-note-tail" fill="none">
          <path d="M58 3C68 15 39 11 34 23C31 29 31 33 26 35M22 27L26 36L36 31" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 15L12 18M14 7L16 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </motion.span>}
    </AnimatePresence>
  </span>;
}

'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { motion, useAnimationControls, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Images } from 'lucide-react';
import type { ProjectImage } from '@/types/project';
import { getStackPose } from '@/lib/gallery-stack';

export default function ProjectGallery({ title, images }: { title: string; images: ProjectImage[] }) {
  const [{ index, previous, direction }, setSlide] = useState({ index: 0, previous: -1, direction: 1 });
  const camera = useAnimationControls();
  const locked = useRef(false);
  const lastIndex = useRef(0);
  const reducedMotion = useReducedMotion();
  const multiple = images.length > 1;
  const activeIndex = images.length ? index % images.length : 0;
  const current = images[activeIndex];
  useEffect(() => {
    if (lastIndex.current === activeIndex) return;
    lastIndex.current = activeIndex;
    if (reducedMotion || !multiple) {
      locked.current = false;
      camera.set({ rotateX: 0, rotateY: 0 });
      return;
    }
    let mounted = true;
    void camera.start({
      rotateX: [0, -5, 0],
      rotateY: [0, direction * 9, 0],
      transition: { duration: 0.85, times: [0, 0.42, 1], ease: [0.4, 0, 0.2, 1] },
    }).then(() => { if (mounted) locked.current = false; });
    return () => { mounted = false; locked.current = false; };
  }, [activeIndex, direction, reducedMotion, multiple, camera]);

  if (!current) return null;
  if (!multiple) return (
    <figure className="mb-8">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl ring-1 ring-foreground/10 sm:aspect-[2/1]">
        <Image src={current.src} alt={current.alt} fill priority unoptimized sizes="(max-width: 1024px) 100vw, 1024px" style={{ objectFit: 'contain', objectPosition: current.position ?? 'center 65%' }} />
      </div>
      <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-subtle">
        {current.caption && <span>{current.caption}</span>}
        <a href={current.src} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-foreground">Open full-resolution image<span className="sr-only"> (opens in a new tab)</span></a>
      </figcaption>
    </figure>
  );

  function goTo(next: number) {
    if (next === activeIndex || locked.current) return;
    locked.current = !reducedMotion;
    setSlide({ index: next, previous: activeIndex, direction: next > activeIndex ? 1 : -1 });
  }
  function step(change: number) {
    if (locked.current) return;
    locked.current = !reducedMotion;
    setSlide({ index: (activeIndex + change + images.length) % images.length, previous: activeIndex, direction: change });
  }
  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!multiple) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
    else if (event.key === 'Home') { event.preventDefault(); goTo(0); }
    else if (event.key === 'End') { event.preventDefault(); goTo(images.length - 1); }
  }

  return (
    <section aria-label={`${title} image gallery`} aria-roledescription="carousel" tabIndex={multiple ? 0 : undefined} onKeyDown={onKeyDown} className="mb-8 min-w-0 rounded-2xl">
      <div className="relative isolate aspect-[16/12] sm:aspect-[16/9]" style={{ perspective: 1400, perspectiveOrigin: '50% 42%' }}>
        <motion.div animate={camera} initial={false} className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
          {images.map((image, i) => {
            const isFront = i === activeIndex;
            const pose = getStackPose(i, activeIndex, images.length);
            const oldPose = getStackPose(i, previous < 0 ? activeIndex : previous, images.length);
            const exchanging = previous >= 0 && previous !== activeIndex && (i === previous || isFront);
            const target = !reducedMotion && exchanging ? {
              x: [oldPose.x, `${(i === previous ? -1 : 1) * direction * 32}%`, pose.x],
              y: [oldPose.y, i === previous ? -32 : 10, pose.y],
              z: [oldPose.z, i === previous ? 145 : -35, pose.z],
              scale: [oldPose.scale, 0.94, pose.scale],
              rotateY: [oldPose.rotateY, direction * (i === previous ? -27 : 19), pose.rotateY],
              rotateZ: [oldPose.rotateZ, direction * (i === previous ? -7 : 4), pose.rotateZ],
            } : pose;
            return <motion.div
              key={`${i}-${image.src}`}
              initial={false}
              animate={target}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.85, times: [0, 0.42, 1], ease: [0.4, 0, 0.2, 1] }}
              drag={isFront && !reducedMotion ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.08}
              onDragEnd={(_, info) => {
                if (info.offset.x < -50 || info.velocity.x < -500) step(1);
                else if (info.offset.x > 50 || info.velocity.x > 500) step(-1);
              }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${images.length}${isFront ? ', current image' : ''}`}
              className="absolute inset-x-[12%] bottom-[9%] top-[16%]"
              style={{ touchAction: 'pan-y', transformStyle: 'preserve-3d' }}
            >
              <div className="absolute inset-0 overflow-hidden rounded-xl border border-line bg-page shadow-card-hover sm:rounded-2xl" style={{ backfaceVisibility: 'hidden' }}>
                <Image src={image.src} alt={isFront ? image.alt : ''} aria-hidden={!isFront} fill priority={i === 0} unoptimized draggable={false} sizes="(max-width: 1024px) 76vw, 780px" className="pointer-events-none select-none" style={{ objectFit: 'contain', objectPosition: image.position ?? 'center 65%' }} />
                {!isFront && <button type="button" tabIndex={-1} aria-hidden="true" onClick={() => goTo(i)} className="absolute inset-0 cursor-pointer" />}
              </div>
            </motion.div>;
          })}
        </motion.div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <div className="min-w-0 flex-1" aria-live="polite" aria-atomic="true">
          <p className="flex items-center gap-2 text-xs text-subtle"><Images className="size-3.5 shrink-0" aria-hidden="true" /><span>{current.caption ?? current.alt}</span></p>
          <a href={current.src} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-xs text-subtle underline underline-offset-4 hover:text-foreground">Open full-resolution image<span className="sr-only"> (opens in a new tab)</span></a>
          {multiple && <p className="sr-only">Image {activeIndex + 1} of {images.length}</p>}
        </div>
        {multiple && <div className="flex shrink-0 items-center gap-2">
          <button type="button" onClick={() => step(-1)} aria-label="Previous image" className="flex size-11 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-foreground"><ArrowLeft className="size-4" aria-hidden="true" /></button>
          <span aria-hidden="true" className="min-w-12 text-center text-xs tabular-nums text-subtle">{activeIndex + 1} / {images.length}</span>
          <button type="button" onClick={() => step(1)} aria-label="Next image" className="flex size-11 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-foreground"><ArrowRight className="size-4" aria-hidden="true" /></button>
        </div>}
      </div>
      {multiple && <div className="mt-4 flex gap-2 overflow-x-auto px-1 py-1" aria-label="Choose a project image">
        {images.map((image, i) => <button key={`${i}-${image.src}`} type="button" onClick={() => goTo(i)} aria-label={`Show image ${i + 1}: ${image.caption ?? image.alt}`} aria-current={i === activeIndex ? 'true' : undefined} className={`relative h-12 w-20 shrink-0 overflow-hidden rounded-md border transition-opacity ${i === activeIndex ? 'border-foreground ring-1 ring-foreground' : 'border-line opacity-55 hover:opacity-100 focus-visible:opacity-100'}`}><Image src={image.src} alt="" fill sizes="80px" style={{ objectFit: 'contain', objectPosition: image.position ?? 'center' }} /></button>)}
      </div>}
    </section>
  );
}

'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRef, useState, type KeyboardEvent } from 'react';
import { ArrowLeft, ArrowRight, Images, Box } from 'lucide-react';
import type { ProjectImage } from '@/types/project';

const StackedProjectGallery = dynamic(() => import('./StackedProjectGallery'));

export default function ProjectGallery({ title, images }: { title: string; images: ProjectImage[] }) {
  const [mode, setMode] = useState<'carousel' | 'stack'>('carousel');
  const [index, setIndex] = useState(0);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const multiple = images.length > 1;
  const activeIndex = images.length ? index % images.length : 0;
  const current = images[activeIndex];

  if (!current) return null;
  if (!multiple) return (
    <figure className="mb-8">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl ring-1 ring-foreground/10 sm:aspect-[2/1]">
        <Image src={current.src} alt={current.alt} fill priority unoptimized sizes="(max-width: 1024px) 100vw, 1024px" style={{ objectFit: 'contain', objectPosition: current.position ?? 'center 65%' }} />
      </div>
      {current.caption && <figcaption className="mt-3 text-xs text-subtle">{current.caption}</figcaption>}
    </figure>
  );

  function goTo(next: number) {
    if (next === activeIndex) return;
    setIndex(next);
  }
  function step(change: number) {
    setIndex(previous => (previous + change + images.length) % images.length);
  }

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!multiple) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
    else if (event.key === 'Home') { event.preventDefault(); goTo(0); }
    else if (event.key === 'End') { event.preventDefault(); goTo(images.length - 1); }
  }

  return (
    <div className="mb-8 min-w-0">
      <div className="mb-4 flex justify-end">
        <div role="group" aria-label="Gallery view" className="inline-flex gap-1 rounded-full border border-line p-1">
          <button type="button" aria-pressed={mode === 'carousel'} onClick={() => setMode('carousel')} className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-xs transition-colors ${mode === 'carousel' ? 'bg-surface-raised text-foreground' : 'text-muted hover:text-foreground'}`}><Images className="size-3.5" aria-hidden="true" />Carousel</button>
          <button type="button" aria-pressed={mode === 'stack'} onClick={() => setMode('stack')} className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-xs transition-colors ${mode === 'stack' ? 'bg-surface-raised text-foreground' : 'text-muted hover:text-foreground'}`}><Box className="size-3.5" aria-hidden="true" />3D view</button>
        </div>
      </div>
      {mode === 'stack' ? <StackedProjectGallery title={title} images={images} initialIndex={activeIndex} onIndexChange={setIndex} /> : (
    <section aria-label={`${title} image gallery`} aria-roledescription="carousel" tabIndex={multiple ? 0 : undefined} onKeyDown={onKeyDown} className="mb-8 min-w-0 rounded-2xl">
      <div
        className="relative isolate aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-surface sm:aspect-video"
        style={{ touchAction: 'pan-y' }}
        onPointerDown={event => {
          if (!event.isPrimary || event.button !== 0) return;
          pointerStart.current = { x: event.clientX, y: event.clientY };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerCancel={() => { pointerStart.current = null; }}
        onPointerUp={event => {
          const start = pointerStart.current;
          pointerStart.current = null;
          if (!start) return;
          const dx = event.clientX - start.x;
          const dy = event.clientY - start.y;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
        }}
      >
        <div className="pointer-events-none absolute inset-0 flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none" style={{ transform: activeIndex === 0 ? 'none' : `translateX(-${activeIndex * 100}%)` }}>
          {images.map((image, i) => <div key={`${i}-${image.src}`} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${images.length}`} aria-hidden={i !== activeIndex} className="relative h-full w-full shrink-0">
            <Image src={image.src} alt={image.alt} fill unoptimized priority={i === 0} draggable={false} sizes="(max-width: 1152px) 100vw, 1152px" className="select-none object-contain" />
          </div>)}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <div className="min-w-0 flex-1" aria-live="polite" aria-atomic="true">
          <p className="flex items-center gap-2 text-xs text-subtle"><Images className="size-3.5 shrink-0" aria-hidden="true" /><span>{current.caption ?? current.alt}</span></p>
          {multiple && <p className="sr-only">Image {activeIndex + 1} of {images.length}</p>}
        </div>
        {multiple && <div className="flex shrink-0 items-center gap-2">
          <button type="button" onClick={() => step(-1)} aria-label="Previous image" className="flex size-11 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-foreground"><ArrowLeft className="size-4" aria-hidden="true" /></button>
          <span aria-hidden="true" className="min-w-12 text-center text-xs tabular-nums text-subtle">{activeIndex + 1} / {images.length}</span>
          <button type="button" onClick={() => step(1)} aria-label="Next image" className="flex size-11 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-foreground"><ArrowRight className="size-4" aria-hidden="true" /></button>
        </div>}
      </div>
      {multiple && <div className="mt-4 flex gap-2 overflow-x-auto px-1 py-1" aria-label="Choose a project image">
        {images.map((image, i) => <button key={`${i}-${image.src}`} type="button" onClick={() => goTo(i)} aria-label={`Show image ${i + 1}: ${image.caption ?? image.alt}`} aria-current={i === activeIndex ? 'true' : undefined} className={`relative h-12 w-20 shrink-0 overflow-hidden rounded-md border transition-opacity ${i === activeIndex ? 'border-accent ring-1 ring-accent' : 'border-line opacity-55 hover:opacity-100 focus-visible:opacity-100'}`}><Image src={image.src} alt="" fill sizes="80px" style={{ objectFit: 'contain', objectPosition: image.position ?? 'center' }} /></button>)}
      </div>}
    </section>
      )}
    </div>
  );
}

'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowLeft, ArrowRight, Expand, Monitor, Smartphone, X } from 'lucide-react';
import type { ProjectImage } from '@/types/project';
import { getImagePresentation, type ProjectPlatform } from '@/lib/project-presentation';

export default function ProjectGallery({ title, images, platform = 'web' }: { title: string; images: ProjectImage[]; platform?: ProjectPlatform }) {
  const [index, setIndex] = useState(0);
  const [dimensions, setDimensions] = useState<Record<string, { width: number; height: number }>>({});
  const [expanded, setExpanded] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const expandButton = useRef<HTMLButtonElement>(null);
  const thumbnails = useRef<(HTMLButtonElement | null)[]>([]);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const current = images[index];
  const presentation = current ? getImagePresentation(current, platform, dimensions[current.src]) : 'artwork';
  const naturalWidth = current?.width ?? dimensions[current?.src ?? '']?.width;
  const naturalHeight = current?.height ?? dimensions[current?.src ?? '']?.height;
  const multiple = images.length > 1;
  const step = (delta: number) => setIndex(value => (value + delta + images.length) % images.length);

  useEffect(() => {
    const thumbnail = thumbnails.current[index];
    const strip = thumbnail?.parentElement;
    if (thumbnail && strip) {
      if (getComputedStyle(strip).flexDirection === 'column') strip.scrollTop = thumbnail.offsetTop - strip.offsetTop - (strip.clientHeight - thumbnail.clientHeight) / 2;
      else strip.scrollLeft = thumbnail.offsetLeft - strip.offsetLeft - (strip.clientWidth - thumbnail.clientWidth) / 2;
    }
  }, [index]);

  useEffect(() => {
    if (!expanded) return;
    const element = dialog.current;
    const overflow = document.body.style.overflow;
    const trigger = expandButton.current;
    document.body.style.overflow = 'hidden';
    element?.showModal();
    return () => { element?.close(); document.body.style.overflow = overflow; trigger?.focus({ preventScroll: true }); };
  }, [expanded]);

  const keyboard = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); step(event.key === 'ArrowRight' ? 1 : -1); }
    if (event.key === 'Home') { event.preventDefault(); setIndex(0); }
    if (event.key === 'End') { event.preventDefault(); setIndex(images.length - 1); }
  };
  if (!current) return null;
  const caption = current.caption && current.caption !== 'Project artwork' ? current.caption : `${title} / ${presentation === 'artwork' ? 'Cover' : 'Screen'} ${index + 1}`;
  const image = (large: boolean) => <Image key={current.src} src={current.src} alt={current.alt} fill priority={index === 0 && !large} unoptimized draggable={false} sizes={large ? '95vw' : '(max-width: 768px) 100vw, 1050px'} className="project-carousel-image" style={{ objectFit: 'contain', objectPosition: 'center' }} onLoad={event => {
    const { naturalWidth: width, naturalHeight: height } = event.currentTarget;
    setDimensions(previous => previous[current.src]?.width === width && previous[current.src]?.height === height ? previous : { ...previous, [current.src]: { width, height } });
  }} />;

  return <section id="project-screens" className="project-carousel" aria-label={`${title} screenshots`} aria-roledescription="carousel" onKeyDown={keyboard} tabIndex={0}>
    <div className="project-carousel-toolbar">      <button ref={expandButton} type="button" className="project-carousel-expand" onClick={() => setExpanded(true)} aria-label="Enlarge screenshot"><Expand size={16} aria-hidden="true" /><span>Enlarge</span></button>
      <span className="project-carousel-format">{presentation === 'mobile' ? <Smartphone size={13} aria-hidden="true" /> : <Monitor size={13} aria-hidden="true" />}{presentation === 'artwork' ? 'Project cover' : presentation === 'mobile' ? 'Mobile screen' : presentation === 'desktop' ? 'Desktop screen' : 'Web screen'}</span>
    </div>
    <div className="project-carousel-stage" data-presentation={presentation} style={{ touchAction: 'pan-y' }}
      onPointerDown={event => {
        if (!event.isPrimary || event.button !== 0 || (event.target as HTMLElement).closest('button')) return;
        pointer.current = { x: event.clientX, y: event.clientY };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerUp={event => {
        const start = pointer.current; pointer.current = null;
        if (start && Math.abs(event.clientX - start.x) > 45 && Math.abs(event.clientX - start.x) > Math.abs(event.clientY - start.y)) step(event.clientX < start.x ? 1 : -1);
      }} onPointerCancel={() => { pointer.current = null; }} onLostPointerCapture={() => { pointer.current = null; }}>
      <div className="project-carousel-frame" data-presentation={presentation} style={presentation === 'mobile' && naturalWidth && naturalHeight ? { aspectRatio: `${naturalWidth} / ${naturalHeight}` } : undefined}>
        <div className="project-carousel-screen">{image(false)}</div>
      </div>

    </div>
    <div className="project-carousel-meta">
      <p aria-live="polite" aria-atomic="true"><span className="project-carousel-count">{index + 1} / {images.length}</span>{caption}</p>
      {multiple && <div className="project-carousel-arrows"><button type="button" onClick={() => step(-1)} aria-label="Previous screenshot"><ArrowLeft size={17} /></button><button type="button" onClick={() => step(1)} aria-label="Next screenshot"><ArrowRight size={17} /></button></div>}
    </div>
    {multiple && <div className="project-carousel-thumbnails" role="group" aria-label="Choose screenshot">
      {images.map((item, i) => <button key={`${item.src}-${i}`} ref={element => { thumbnails.current[i] = element; }} type="button" onClick={() => setIndex(i)} aria-label={`Show screenshot ${i + 1}: ${item.alt}`} aria-current={index === i ? 'true' : undefined}><Image src={item.src} alt="" fill unoptimized sizes="84px" style={{ objectFit: 'contain' }} /><span>{i + 1}</span></button>)}
    </div>}
    {expanded && <dialog ref={dialog} className="project-lightbox" aria-label={`${title} enlarged screenshots`} data-lenis-prevent onCancel={event => { event.preventDefault(); setExpanded(false); }} onClick={event => { if (event.target === event.currentTarget) setExpanded(false); }}>
      <div className="project-lightbox-content"><div className="project-lightbox-heading"><span>{title} &middot; {index + 1} / {images.length}</span><button type="button" onClick={() => setExpanded(false)} aria-label="Close enlarged screenshot"><X size={20} /></button></div><div className="project-lightbox-image">{image(true)}</div><div className="project-lightbox-footer"><button type="button" onClick={() => step(-1)} disabled={!multiple} aria-label="Previous enlarged screenshot"><ArrowLeft size={18} /></button><p>{caption}</p><button type="button" onClick={() => step(1)} disabled={!multiple} aria-label="Next enlarged screenshot"><ArrowRight size={18} /></button></div></div>
    </dialog>}
  </section>;
}

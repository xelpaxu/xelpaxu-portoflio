'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import TechStack from '@/components/TechStack';
import type { Project } from '@/types/project';
import { getProjectImages } from '@/lib/project-images';

const statusLabels = { operational: 'Live', beta: 'Beta', 'coming-soon': 'Coming soon', archived: 'Archived', project: 'Project' };
const colors = { operational: 'bg-success', beta: 'bg-warning', 'coming-soon': 'bg-info', archived: 'bg-subtle', project: 'bg-subtle' };

export default function ProjectPreviewCard({ project, iconOnly = false, showBuildDetails = true }: { project: Project; iconOnly?: boolean; showBuildDetails?: boolean }) {
  const images = getProjectImages(project);
  const [imageIndex, setImageIndex] = useState(0);
  const [peek, setPeek] = useState(false);
  const reducedMotion = useReducedMotion();
  const cover = images[imageIndex % Math.max(images.length, 1)];
  const highlights = project.caseStudy?.features.slice(0, 2) ?? [];
  function step(direction: number) { setImageIndex(index => (index + direction + images.length) % images.length); }
  return (
    <article className="group flex min-w-0 flex-col bg-transparent">
      {cover && <div className="relative mb-5">
        <Link href={project.link} aria-label={`Preview ${project.title}`} className="relative block aspect-[16/10] overflow-hidden rounded-xl ring-1 ring-inset ring-accent/20 focus-visible:outline-offset-4">
        <Image src={cover.src} alt={cover.alt} fill unoptimized sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) 45vw, 540px" style={{ objectPosition: cover.position ?? 'center', objectFit: cover.fit ?? 'cover' }} className="transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.035]" />
        {cover.caption && <span className="absolute bottom-2.5 right-2.5 rounded-md bg-black/60 px-2 py-1 text-[10px] text-white backdrop-blur-sm">{cover.caption}</span>}
        </Link>
        {images.length > 1 && <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex flex-wrap" role="group" aria-label={`${project.title} screenshots`}>
            {images.map((image, index) => <button key={`${image.src}-${index}`} type="button" aria-label={`Show ${project.title} screenshot ${index + 1}`} aria-pressed={imageIndex === index} onClick={() => setImageIndex(index)} className="flex h-11 w-7 items-center justify-center rounded-md"><span className={`h-1.5 rounded-full transition-all ${imageIndex === index ? 'w-5 bg-accent' : 'w-1.5 bg-accent/25'}`} /></button>)}
          </div>
          <div className="flex shrink-0 items-center">
            <button type="button" onClick={() => step(-1)} aria-label={`Previous ${project.title} screenshot`} className="flex size-11 items-center justify-center rounded-full text-muted hover:text-accent"><ArrowLeft className="size-4" aria-hidden="true" /></button>
            <span className="text-xs tabular-nums text-subtle" aria-live="polite">{imageIndex + 1}/{images.length}</span>
            <button type="button" onClick={() => step(1)} aria-label={`Next ${project.title} screenshot`} className="flex size-11 items-center justify-center rounded-full text-muted hover:text-accent"><ArrowRight className="size-4" aria-hidden="true" /></button>
          </div>
        </div>}
      </div>}
      <div className="flex flex-1 items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h3 className="text-lg font-semibold tracking-tight"><Link href={project.link} className="transition-colors hover:text-accent">{project.title}</Link></h3>
            {project.status !== 'project' && <span className="inline-flex items-center gap-1.5 text-xs text-subtle"><span className={`size-1.5 rounded-full ${colors[project.status]}`} />{statusLabels[project.status]}</span>}
          </div>
          <p className="mt-2 text-sm leading-6 text-muted">{project.description}</p>
        </div>
        <Link href={project.link} aria-label={`View ${project.title}`} className="flex size-11 shrink-0 items-center justify-center text-subtle transition-colors hover:text-foreground"><ArrowUpRight className="size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></Link>
      </div>
      <div className="mt-5 border-t border-line pt-4"><TechStack tags={project.tags} iconOnly={iconOnly} /></div>
      {showBuildDetails && !!highlights.length && <div className="mt-2">
        <button type="button" onClick={() => setPeek(!peek)} aria-expanded={peek} aria-controls={`${project.id}-peek`} className="flex min-h-11 w-full items-center justify-between gap-3 text-left text-xs text-muted hover:text-accent">Behind the build<ChevronDown className={`size-4 transition-transform ${peek ? 'rotate-180' : ''}`} aria-hidden="true" /></button>
        <AnimatePresence initial={false}>{peek && <motion.div id={`${project.id}-peek`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.22 }} className="overflow-hidden"><ul className="space-y-3 pb-3 pt-2">{highlights.map(feature => <li key={feature.title} className="border-l-2 border-accent/40 pl-3"><p className="text-xs font-medium text-strong">{feature.title}</p><p className="mt-1 text-xs leading-5 text-muted">{feature.description}</p></li>)}</ul></motion.div>}</AnimatePresence>
      </div>}
    </article>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ArrowUpRight, Quote } from 'lucide-react';
import { testimonials } from '@/data/testimonials';
import { projects } from '@/data/projects/projects';
import { profile } from '@/data/profile';

export default function Testimonials({ projectId }: { projectId?: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const entries = testimonials.filter(item =>
    projects.some(project => project.id === item.projectId) &&
    (projectId ? item.projectId === projectId : item.featured),
  );
  const currentIndex = entries.length ? activeIndex % entries.length : 0;
  const visibleEntries = projectId ? entries : entries.slice(currentIndex, currentIndex + 1);
  const project = projects.find(item => item.id === projectId);
  const subject = project ? `Feedback on ${project.title}` : 'Working together: a testimonial';

  if (!entries.length) return (
    <div className="border-t border-line py-6">
      <p className="text-sm leading-7 text-muted">{projectId ? 'Feedback from co-developers and users will appear here.' : 'A space for feedback from the people I build with.'}</p>
      <a href={`mailto:${profile.email}?subject=${encodeURIComponent(subject)}`} className="mt-2 inline-flex min-h-11 items-center gap-2 text-xs font-medium text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
        {projectId ? 'Worked on or used this project? Share your experience' : 'Worked together? Share your experience'}
        <ArrowUpRight className="size-3.5 shrink-0" aria-hidden="true" />
      </a>
    </div>
  );

  return (
    <div>
    <div className={projectId ? 'grid gap-x-8 gap-y-7 sm:grid-cols-2' : 'min-w-0'} aria-live={projectId ? undefined : 'polite'} aria-atomic={projectId ? undefined : true}>
      {visibleEntries.map(item => {
        const relatedProject = projects.find(project => project.id === item.projectId)!;
        return (
          <figure key={item.id} className="min-w-0 border-t border-line pt-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <Quote className="size-4 text-accent" aria-hidden="true" />
              {item.sample && <span className="rounded-full border border-line px-2 py-1 text-[11px] text-muted">Sample testimonial</span>}
            </div>
            <blockquote className="break-words text-base leading-8 tracking-tight text-strong"><p>{item.quote}</p></blockquote>
            <figcaption className="mt-5 flex items-start gap-3">
              {item.image && <Image src={item.image} alt="" width={40} height={40} unoptimized className="size-10 shrink-0 rounded-full object-cover" />}
              <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-xs text-muted">{item.relationship === 'co-developer' ? 'Co-developer' : 'User'}</span>
              </div>
              <p className="mt-1 text-xs leading-6 text-muted">{item.role}</p>
              {!projectId && <Link href={relatedProject.link} className="mt-1 inline-flex min-h-11 items-center gap-1.5 text-xs text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">{relatedProject.title}<ArrowUpRight className="size-3" aria-hidden="true" /></Link>}
              </div>
            </figcaption>
          </figure>
        );
      })}
    </div>
    {!projectId && entries.length > 1 && (
      <nav aria-label="Featured testimonials" className="mt-6 flex items-center justify-between gap-4 border-t border-line pt-3">
        <p className="text-xs tabular-nums text-muted">{currentIndex + 1} / {entries.length}</p>
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Previous featured testimonial" onClick={() => setActiveIndex((currentIndex - 1 + entries.length) % entries.length)} className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-xs text-muted transition-colors hover:bg-surface-raised hover:text-foreground"><ArrowLeft className="size-4" aria-hidden="true" />Previous</button>
          <button type="button" aria-label="Next featured testimonial" onClick={() => setActiveIndex((currentIndex + 1) % entries.length)} className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-xs text-strong transition-colors hover:bg-surface-raised">Next<ArrowRight className="size-4" aria-hidden="true" /></button>
        </div>
      </nav>
    )}
    </div>
  );
}

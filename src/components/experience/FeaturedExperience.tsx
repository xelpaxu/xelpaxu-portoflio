"use client";

import { useState } from 'react';
import Image from 'next/image';
import TechStack from '@/components/TechStack';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Experience } from '@/types/experience';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

type FeaturedExperienceProps = Experience & { card?: boolean; expanded?: boolean; onToggle?: () => void };

export default function FeaturedExperience({
  card = false,
  expanded,
  onToggle,
  id,
  logo,
  title,
  role,
  startDate,
  endDate,
  location,
  technologies,
  description,
  notes
}: FeaturedExperienceProps) {
  const [logoFailed, setLogoFailed] = useState(false);
  const [localExpanded, setLocalExpanded] = useState(card);
  const isExpanded = expanded ?? localExpanded;
  const reducedMotion = useReducedMotion();


  return (
    <article className="border-b border-line bg-transparent last:border-0">
      <div className="py-6">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:gap-4">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-surface-raised">
              {logoFailed ? <span className="flex h-full items-center justify-center text-sm text-muted">{title.slice(0, 2)}</span> : <Image
                onError={() => setLogoFailed(true)}
                sizes="48px"
                src={logo}
                alt={`${title} logo`}
                fill
                className="object-cover p-2"
              />}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-foreground"><Link href={`/experience#${id}`} className="transition-colors hover:text-accent">{title}</Link></h3>
                <button
                  aria-label={`${isExpanded ? "Collapse" : "Expand"} ${title}`}
                  aria-expanded={isExpanded}
                  aria-controls={`${id}-details`}
                  onClick={() => onToggle ? onToggle() : setLocalExpanded(!isExpanded)}
                  className="flex size-11 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-surface-raised"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className={`h-4 w-4 text-subtle transition-transform duration-300 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </button>
              </div>
              <p className="mt-1 text-sm text-muted">{role}</p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-1 pl-16 sm:items-end sm:pl-0 sm:flex-shrink-0">
            <span className="text-sm text-muted whitespace-nowrap">
              {startDate} - {endDate}
            </span>
            {location && (
              <span className="text-xs text-subtle">
                {location}
              </span>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>{isExpanded && (
        <motion.div id={`${id}-details`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.25 }} className="overflow-hidden">
        <div className={card ? "border-t border-line pb-6 pt-5 sm:ml-16" : "pb-6 pl-0 sm:pl-16"}>
          {description && (
            <p className="mb-4 text-sm text-muted">{description}</p>
          )}

          {!!technologies?.length && <div className="mb-5"><TechStack tags={technologies} /></div>}

          {notes && notes.length > 0 && (
            <div className="space-y-3">
              {notes.map((note, index) => (
                <p key={index} className="text-sm text-muted">
                  • {note}
                </p>
              ))}
            </div>
          )}
          {card && <Link href={`/experience#${id}`} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm text-strong hover:text-foreground">View role details<ArrowUpRight className="size-4" aria-hidden="true" /></Link>}
        </div>
        </motion.div>
      )}</AnimatePresence>
    </article>
  );
}

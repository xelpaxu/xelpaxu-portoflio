import PortfolioEmptyState from '@/components/PortfolioEmptyState';
import Image from 'next/image';
import Link from 'next/link';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { ArrowUpRight, MapPin, ArrowDownRight } from 'lucide-react';
import { workExperiences } from '@/data/experience/work-experience';
import { education } from '@/data/experience/journey';
import TechStack from '@/components/TechStack';

const roles = [...workExperiences].sort((a, b) => Date.parse(b.startDate) - Date.parse(a.startDate));
const milestones = education.filter((item, i, all) => all.findIndex(other => other.title === item.title && other.date === item.date) === i)
  .sort((a, b) => Number(b.date) - Number(a.date));

export default function ExperienceArchive() {
  return (
    <div className="mx-auto max-w-[760px]">
      <nav aria-label="Experience sections" className="mb-10 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm sm:mb-14">
        <a href="#work-history" className="inline-flex min-h-11 items-center gap-2 border-b border-accent text-accent">Work experience<ArrowDownRight className="size-3.5" aria-hidden="true" /></a>
        <a href="#learning-journey" className="inline-flex min-h-11 items-center gap-2 border-b border-transparent text-subtle transition-colors hover:border-line-strong hover:text-foreground">Learning journey<ArrowDownRight className="size-3.5" aria-hidden="true" /></a>
      </nav>
      <section id="work-history" aria-labelledby="work-heading" className="scroll-mt-28">
        <h2 id="work-heading" className="sr-only">Work experience</h2>
        {roles.length === 0 ? <PortfolioEmptyState kind="experience" /> : <ol className="divide-y divide-line border-y border-line">
          {roles.map(role => {
            const hasLogo = role.logo.startsWith('/') && existsSync(path.join(process.cwd(), 'public', role.logo));
            const initials = role.title.split(' ').slice(0, 2).map(word => word[0]).join('');
            return <li key={role.id}>
              <article id={role.id} className="scroll-mt-28 bg-transparent py-8 sm:py-10">
                <header className="flex items-start gap-4">
                  <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line text-sm font-semibold text-strong sm:size-14">
                    {hasLogo ? <Image src={role.logo} alt="" fill sizes="56px" className="object-contain p-2" /> : <span aria-hidden="true">{initials}</span>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:gap-5">
                      <div><h3 className="text-xl font-semibold leading-snug tracking-tight sm:text-2xl">{role.title}</h3><p className="mt-1 text-sm font-medium text-strong sm:text-base">{role.role}</p></div>
                      <div className="shrink-0 text-xs leading-6 text-subtle sm:pt-0.5 sm:text-right"><p>{role.startDate} - {role.endDate}</p>{role.location && <p className="flex items-center gap-1.5 sm:justify-end"><MapPin className="size-3" aria-hidden="true" />{role.location}</p>}</div>
                    </div>
                  </div>
                </header>
                <div className="mt-6 sm:ml-[72px]">
                  {role.description && <p className="mb-5 max-w-prose text-base leading-8 text-muted">{role.description}</p>}
                  {!!role.notes?.length && <ul className="space-y-3.5">{role.notes.map(note => <li key={note} className="flex items-start gap-3 text-base leading-7 text-muted"><span className="mt-3 size-1 shrink-0 rounded-full bg-subtle" aria-hidden="true" /><span>{note}</span></li>)}</ul>}
                  {!!role.technologies?.length && <div className="mt-6 border-t border-line/60 pt-5 [&_li]:text-sm"><TechStack tags={role.technologies} /></div>}
                </div>
              </article>
            </li>;
          })}
        </ol>}
      </section>
      <section id="learning-journey" aria-labelledby="journey-heading" className="mt-16 scroll-mt-28 sm:mt-20">
        <div className="mb-7 text-center"><h2 id="journey-heading" className="text-2xl font-semibold tracking-tight">Learning journey</h2><p className="mt-2 text-sm text-muted">A few of the steps that brought me here.</p></div>
        <ol className="divide-y divide-line border-y border-line">{milestones.map(item => <li key={item.id} className="flex items-start gap-5 py-7 sm:gap-7"><span className="mt-0.5 min-w-12 text-sm font-medium tabular-nums text-subtle">{item.date}</span><div className="min-w-0"><h3 className="text-base font-semibold leading-7">{item.title}</h3><p className="mt-2 text-sm leading-7 text-muted">{item.description}</p></div></li>)}</ol>
      </section>
      <div className="mt-12 flex flex-col items-center justify-center gap-2 text-center sm:mt-16"><p className="text-sm text-muted">Interested in working together?</p><Link href="/#contact" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium transition-colors hover:text-accent">Get in touch<ArrowUpRight className="size-4" aria-hidden="true" /></Link></div>
    </div>
  );
}

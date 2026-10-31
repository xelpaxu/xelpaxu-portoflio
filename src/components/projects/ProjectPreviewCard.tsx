import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import TechStack from '@/components/TechStack';
import type { Project } from '@/types/project';
import { getProjectImages } from '@/lib/project-images';

const statusLabels = { operational: 'Live', beta: 'Beta', 'coming-soon': 'Coming soon', archived: 'Archived', project: 'Project' };
const colors = { operational: 'bg-success', beta: 'bg-warning', 'coming-soon': 'bg-info', archived: 'bg-subtle', project: 'bg-subtle' };

export default function ProjectPreviewCard({ project, iconOnly = false }: { project: Project; iconOnly?: boolean }) {
  const cover = getProjectImages(project)[0];
  return (
    <article className="group flex min-w-0 flex-col bg-transparent">
      {cover && <Link href={project.link} aria-label={`Preview ${project.title}`} className="relative mb-5 block aspect-[16/10] overflow-hidden rounded-xl ring-1 ring-inset ring-foreground/10 focus-visible:outline-offset-4">
        <Image src={cover.src} alt={cover.alt} fill sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) 45vw, 540px" style={{ objectPosition: cover.position ?? 'center', objectFit: cover.fit ?? 'cover' }} className="transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.035]" />
        {cover.caption && <span className="absolute bottom-2.5 right-2.5 rounded-md bg-black/60 px-2 py-1 text-[10px] text-white backdrop-blur-sm">{cover.caption}</span>}
      </Link>}
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
    </article>
  );
}

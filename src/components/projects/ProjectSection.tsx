import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { projects } from '@/data/projects/projects';
import ProjectPreviewCard from './ProjectPreviewCard';

export default function ProjectsSection() {
  const featured = projects.filter(project => project.featured);
  const selected = featured.length ? featured : projects.slice(0, 3);
  return (
    <div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2">
        {selected.map(project => <ProjectPreviewCard key={project.id} project={project} iconOnly />)}
      </div>
      <Link href="/projects" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted hover:text-foreground">Explore all projects<ArrowRight className="size-4" aria-hidden="true" /></Link>
    </div>
  );
}

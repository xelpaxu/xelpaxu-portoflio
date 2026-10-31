import { ArrowUpRight, ExternalLink, Play } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { getProjectLinks } from '@/lib/project-links';
import type { Project } from '@/types/project';

export default function ProjectActions({ project, align = 'center' }: { project: Project; align?: 'start' | 'center' }) {
  const links = getProjectLinks(project);
  if (!links.length) return null;
  return <div aria-label="Project links" className={`flex flex-wrap gap-3 ${align === 'start' ? 'justify-start' : 'justify-center'}`}>
    {links.map(link => {
      const Icon = link.kind === 'github' ? FaGithub : link.kind === 'video' ? Play : ExternalLink;
      return <a key={`${link.kind}-${link.href}`} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`${link.label}: ${project.title} (opens in a new tab)`} className={`inline-flex min-h-12 items-center gap-2.5 rounded-full border px-5 py-3 text-sm font-medium transition-colors ${link.kind !== 'github' ? 'border-foreground bg-foreground text-inverse hover:bg-action-hover' : 'border-line bg-transparent text-strong hover:border-line-strong hover:text-foreground'}`}><Icon className="size-4" aria-hidden="true" />{link.label}<ArrowUpRight className="ml-1 size-3.5" aria-hidden="true" /></a>;
    })}
  </div>;
}

'use client';

import { useState } from 'react';
import { Search, X, ArrowUpRight } from 'lucide-react';
import ProjectPreviewCard from './ProjectPreviewCard';
import { projects } from '@/data/projects/projects';
import { profile } from '@/data/profile';

const normalize = (tag: string) => tag === 'TS' ? 'TypeScript' : tag;
const technologies = Array.from(new Set(projects.flatMap(project => project.tags.map(normalize)))).sort();
const quickTechnologies = ['All', 'React', 'Next.js', 'Flutter', 'Python', 'TypeScript'];

export default function ProjectExplorer() {
  const [query, setQuery] = useState('');
  const [technology, setTechnology] = useState('All');
  const filtered = projects.filter(project =>
    (technology === 'All' || project.tags.map(normalize).includes(technology)) &&
    [project.title, project.description, ...project.tags.map(normalize)].join(' ').toLowerCase().includes(query.trim().toLowerCase())
  );
  const reset = () => { setQuery(''); setTechnology('All'); };
  return (
    <section aria-label="Browse projects" className="mx-auto max-w-4xl">
      <div className="mb-7 flex flex-col items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search aria-hidden="true" className="absolute left-4 top-4 size-4 text-subtle" />
          <input aria-label="Search projects" type="search" placeholder="Find a project or technology" value={query} onChange={event => setQuery(event.target.value)} className="min-h-12 w-full rounded-full border border-line bg-transparent py-3 pl-11 pr-12 text-sm text-foreground transition-colors placeholder:text-subtle hover:border-line-strong" />
          {query && <button aria-label="Clear search" onClick={() => setQuery('')} className="absolute right-0 top-0 flex size-11 items-center justify-center text-muted hover:text-foreground"><X className="size-4" /></button>}
        </div>
        <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-foreground">More on GitHub<ArrowUpRight className="size-4" aria-hidden="true" /></a>
      </div>
      <div className="mx-auto mb-8 flex max-w-2xl flex-wrap items-center justify-center gap-2" aria-label="Filter by technology">
        {quickTechnologies.map(tech => <button key={tech} aria-pressed={technology === tech} onClick={() => setTechnology(tech)} className={`min-h-11 rounded-full border px-4 py-2 text-xs font-medium transition-colors ${technology === tech ? 'border-foreground bg-foreground text-inverse' : 'border-line bg-transparent text-muted hover:border-line-strong hover:text-foreground'}`}>{tech}</button>)}
        <select aria-label="More technology filters" value={quickTechnologies.includes(technology) ? '' : technology} onChange={event => { if (event.target.value) setTechnology(event.target.value); }} className="min-h-11 max-w-full rounded-full border border-line bg-page px-3 text-xs text-muted">
          <option value="">More stacks</option>
          {technologies.filter(tech => !quickTechnologies.includes(tech)).map(tech => <option key={tech} value={tech}>{tech}</option>)}
        </select>
      </div>
      <div className="mb-9 flex min-h-11 flex-wrap items-center justify-center gap-x-5 gap-y-2 border-b border-line pb-5">
        <p role="status" className="text-xs text-subtle">{filtered.length} {filtered.length === 1 ? 'project' : 'projects'}{technology !== 'All' ? ` using ${technology}` : ' to explore'}</p>
        {(query || technology !== 'All') && <button onClick={reset} className="inline-flex min-h-11 items-center gap-1.5 text-xs text-muted hover:text-foreground"><X className="size-3.5" aria-hidden="true" />Clear filters</button>}
      </div>
      <h2 className="sr-only">Project collection</h2>
      <div className="project-archive-grid grid gap-x-7 gap-y-12 sm:grid-cols-2">
        {filtered.map(project => <ProjectPreviewCard key={project.id} project={project} />)}
      </div>
      {filtered.length === 0 && <div className="border-b border-line py-16 text-center"><Search className="mx-auto mb-5 size-7 text-subtle" aria-hidden="true" /><h2 className="text-lg font-medium">No matching projects</h2><p className="mt-2 text-sm text-muted">Try a different name or choose another technology.</p><button onClick={reset} className="mt-5 min-h-11 text-sm underline underline-offset-4">Reset filters</button></div>}
    </section>
  );
}

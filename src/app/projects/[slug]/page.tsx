import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, ArrowUpRight } from 'lucide-react';
import { projects } from '@/data/projects/projects';
import RouteShell from '@/components/RouteShell';
import TechStack from '@/components/TechStack';
import ProjectActions from '@/components/projects/ProjectActions';
import { getProjectLinks } from '@/lib/project-links';
import ProjectGallery from '@/components/projects/ProjectGallery';
import { getProjectImages } from '@/lib/project-images';

export function generateStaticParams() { return projects.map(project => ({ slug: project.id })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find(item => item.id === slug);
  return { title: `${project?.title ?? 'Project not found'} | Axel John Nuqui`, description: project?.description };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find(item => item.id === slug);
  if (!project) notFound();
  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const study = project.caseStudy;
  const features = study?.features ?? project.notes?.map(note => ({ title: note, description: '' })) ?? [];
  const links = getProjectLinks(project);
  return <RouteShell>
    <nav aria-label="Breadcrumb" className="mb-9 flex flex-wrap items-center justify-start gap-2 text-xs text-subtle"><Link href="/" className="hover:text-foreground">Home</Link><span aria-hidden="true">/</span><Link href="/projects" className="hover:text-foreground">Projects</Link><span aria-hidden="true">/</span><span aria-current="page" className="text-strong">{project.title}</span></nav>
    <header className="mb-9">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div className="min-w-0">{project.category && <p className="mb-3 text-xs text-subtle">{project.category}</p>}<h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">{project.title}</h1></div>
        {!!links.length && <div className="shrink-0"><ProjectActions project={project} align="start" /></div>}
      </div>
      <p className="mt-5 max-w-3xl text-base leading-8 text-muted">{project.description}</p>
    </header>
    <ProjectGallery key={project.id} title={project.title} images={getProjectImages(project)} />
    <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-16">
      <div className="min-w-0 space-y-10 sm:space-y-12">
        <section id="overview" aria-labelledby="overview-heading" className="scroll-mt-28">
          <h2 id="overview-heading" className="text-2xl font-semibold tracking-tight">Overview</h2>
          <div className="mt-5 max-w-prose space-y-5">{(study?.overview ?? [project.description]).map(paragraph => <p key={paragraph} className="text-base leading-8 text-muted">{paragraph}</p>)}</div>
          {study && <div className="mt-6 border-l-2 border-line-strong pl-5"><h3 className="text-sm font-semibold">The goal</h3><p className="mt-2 text-sm leading-7 text-muted">{study.goal}</p></div>}
        </section>
        {!!project.components?.length && <section aria-labelledby="applications-heading" className="border-t border-line pt-7"><h2 id="applications-heading" className="text-xl font-semibold tracking-tight">Two connected applications</h2><div className="mt-6 grid gap-7 sm:grid-cols-2">{project.components.map(component => <article key={component.name}><h3 className="text-base font-semibold">{component.name}</h3><p className="mt-2 text-sm leading-7 text-muted">{component.description}</p><div className="mt-4"><TechStack tags={component.tags} /></div>{component.github && <a href={component.github} target="_blank" rel="noopener noreferrer" aria-label={`View ${component.name} on GitHub (opens in a new tab)`} className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-strong hover:text-accent">{component.name} on GitHub<ArrowUpRight className="size-3.5" aria-hidden="true" /></a>}</article>)}</div></section>}
        {!!features.length && <section id="features" aria-labelledby="features-heading" className="scroll-mt-28 border-t border-line pt-7">
          <h2 id="features-heading" className="text-xl font-semibold tracking-tight">What it does</h2>
          <ul className="mt-6 space-y-6">{features.map(feature => <li key={feature.title} className="flex items-start gap-3"><Check className="mt-1 size-4 shrink-0 text-subtle" aria-hidden="true" /><div><h3 className="text-sm font-semibold leading-6">{feature.title}</h3>{feature.description && <p className="mt-2 text-sm leading-7 text-muted">{feature.description}</p>}</div></li>)}</ul>
        </section>}
        {study && <section id="workflow" aria-labelledby="workflow-heading" className="scroll-mt-28 border-t border-line pt-7"><h2 id="workflow-heading" className="text-xl font-semibold tracking-tight">A typical workflow</h2><ol className="mt-6 space-y-4">{study.workflow.map((step, i) => <li key={step} className="flex items-start gap-3"><span aria-hidden="true" className="flex size-6 shrink-0 items-center justify-center rounded-full border border-line text-[11px] text-subtle">{i + 1}</span><p className="text-sm leading-7 text-muted">{step}</p></li>)}</ol></section>}
      </div>
      <aside className="min-w-0 self-start border-t border-line pt-6 lg:sticky lg:top-28" aria-label="Project information">
        <h2 className="text-sm font-semibold">Built with</h2><div className="mt-5"><TechStack tags={project.tags} /></div>
        {study && <div className="mt-7 space-y-4 border-t border-line pt-5">{study.technicalNotes.map(note => <p key={note} className="text-xs leading-6 text-muted">{note}</p>)}</div>}
        <dl className="mt-7 space-y-5 border-t border-line pt-5 text-sm"><div><dt className="text-xs text-subtle">Collection</dt><dd className="mt-1.5">{project.featured ? 'Featured work' : 'Projects'}</dd></div>{study && <div><dt className="text-xs text-subtle">Who it is for</dt><dd className="mt-1.5 text-sm leading-7 text-muted">{study.audience}</dd></div>}</dl>
        {!!links.length && <nav aria-label="Project resources" className="mt-6 border-t border-line pt-3">{links.map(link => <a key={`${link.kind}-${link.href}`} href={link.href} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center justify-between gap-3 text-sm text-strong hover:text-accent">{link.label}<ArrowUpRight className="size-3.5" aria-hidden="true" /></a>)}</nav>}
      </aside>
    </div>
    <nav aria-label="More projects" className="mt-16 grid grid-cols-2 gap-6 border-t border-line pt-7"><Link href={previous.link} className="group min-w-0"><span className="flex items-center gap-2 text-xs text-subtle"><ArrowLeft className="size-3.5" aria-hidden="true" />Previous project</span><span className="mt-2 block text-lg font-medium group-hover:text-accent">{previous.title}</span></Link><Link href={next.link} className="group min-w-0 text-right"><span className="flex items-center justify-end gap-2 text-xs text-subtle">Next project<ArrowRight className="size-3.5" aria-hidden="true" /></span><span className="mt-2 block text-lg font-medium group-hover:text-accent">{next.title}</span></Link></nav>
  </RouteShell>;
}

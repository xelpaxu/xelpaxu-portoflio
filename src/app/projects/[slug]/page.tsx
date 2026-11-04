import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ArrowUpRight, BriefcaseBusiness, MonitorSmartphone, CircleDot } from 'lucide-react';
import { projects } from '@/data/projects/projects';
import RouteShell from '@/components/RouteShell';
import TechStack from '@/components/TechStack';
import ProjectActions from '@/components/projects/ProjectActions';
import { getProjectLinks } from '@/lib/project-links';
import ProjectGallery from '@/components/projects/ProjectGallery';
import { getProjectImages } from '@/lib/project-images';
import LikeButton from '@/components/LikeButton';
import Testimonials from '@/components/Testimonials';
import { testimonials } from '@/data/testimonials';
import { getProjectPlatform, platformLabels } from '@/lib/project-presentation';
import ContactButton from '@/components/ContactButton';
import ProjectDetailTabs, { type ProjectDetailTab } from '@/components/projects/ProjectDetailTabs';
import ProjectFeatures from '@/components/projects/ProjectFeatures';
import ProjectWorkflow from '@/components/projects/ProjectWorkflow';
import { projectDetails } from '@/data/projects/project-details';

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
  const platform = getProjectPlatform(project);
  const hasTestimonials = testimonials.some(item => item.projectId === project.id);
  const study = project.caseStudy;
  const features = study?.features ?? project.notes?.map(note => ({ title: note, description: '' })) ?? [];
  const detailContent = projectDetails[project.id];
  const featureGroups = detailContent?.featureGroups ?? [{ title: 'Core capabilities', summary: project.description, features }];
  const journeys = detailContent?.journeys ?? (study?.workflow.length ? [{ id: 'main', title: 'A typical workflow', summary: project.description, steps: study.workflow.map((description, index) => ({ title: `Step ${index + 1}`, actor: 'User', description, result: '' })) }] : []);
  const links = getProjectLinks(project);
  const statusLabels = { operational: 'Live', beta: 'Beta', 'coming-soon': 'Coming soon', archived: 'Archived', project: 'Project' };
  const previousCover = getProjectImages(previous)[0];
  const nextCover = getProjectImages(next)[0];
  const detailTabs: ProjectDetailTab[] = [
    {
      id: 'overview', label: 'Overview', content: <div className="project-tab-overview">
        <div><h2>About the project</h2><div className="project-tab-prose">{(study?.overview ?? [project.description]).map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div></div>
        <aside className="project-tab-context" aria-label="Project context">
          {study && <><div><h3>The goal</h3><p>{study.goal}</p></div><div><h3>Who it is for</h3><p>{study.audience}</p></div></>}
          <div><h3>Platform</h3><p>{platformLabels[platform]}</p></div>
        </aside>
      </div>,
    },
    ...(featureGroups.some(group => group.features.length) ? [{
      id: 'features', label: 'Features', content: <ProjectFeatures groups={featureGroups} />,
    }] : []),
    ...(journeys.length ? [{
      id: 'workflow', label: 'Workflow', content: <ProjectWorkflow journeys={journeys} />,
    }] : []),
    {
      id: 'build', label: 'Build details', content: <div className="project-tab-build">
        <div><h2>Built with</h2><div className="mt-5"><TechStack tags={project.tags} /></div>
          {!!study?.technicalNotes.length && <div className="project-tab-prose mt-6">{study.technicalNotes.map(note => <p key={note}>{note}</p>)}</div>}
          {!!links.length && <nav aria-label="Project resources" className="project-tab-resources">{links.map(link => <a key={`${link.kind}-${link.href}`} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}<ArrowUpRight size={14} aria-hidden="true" /></a>)}</nav>}
        </div>
        {!!project.components?.length && <div className="project-tab-applications"><h2>Connected applications</h2>{project.components.map(component => <article key={component.name}><h3>{component.name}</h3><p>{component.description}</p><div className="mt-4"><TechStack tags={component.tags} /></div>{component.github && <a href={component.github} target="_blank" rel="noopener noreferrer">{component.name} on GitHub<ArrowUpRight size={14} aria-hidden="true" /></a>}</article>)}</div>}
      </div>,
    },
    ...(hasTestimonials ? [{
      id: 'feedback', label: 'Feedback', content: <div><h2>From the people behind the project</h2><p className="mb-6 mt-3 text-sm leading-7 text-muted">From the people who built and used {project.title}.</p><Testimonials projectId={project.id} /></div>,
    }] : []),
  ];
  return <RouteShell>
    <article className="case-study">
      <div className="case-topline"><Link href="/projects"><ArrowLeft size={15} aria-hidden="true" />All projects</Link><span>{project.category ?? platformLabels[platform]}</span></div>
      <header className="case-hero">
        <div className="case-title"><h1>{project.title}</h1></div>
        {!!links.length && <div className="case-hero-actions"><ProjectActions project={project} align="start" /></div>}
      </header>
      <div className="case-facts">
        {project.role && <div className="case-fact"><BriefcaseBusiness size={17} aria-hidden="true" /><dl><dt>My role</dt><dd>{project.role}</dd></dl></div>}
        <div className="case-fact"><MonitorSmartphone size={17} aria-hidden="true" /><dl><dt>Platform</dt><dd>{platformLabels[platform]}</dd></dl></div>
        {project.status !== 'project' && <div className="case-fact"><CircleDot size={17} aria-hidden="true" /><dl><dt>Status</dt><dd>{statusLabels[project.status]}</dd></dl></div>}
        <div className="case-appreciation"><LikeButton key={project.id} projectId={project.id} title={project.title} /></div>
      </div>
      <div className="case-workspace">
        <ProjectGallery key={`gallery-${project.id}`} title={project.title} images={getProjectImages(project)} platform={platform} />
        <ProjectDetailTabs key={`details-${project.id}`} tabs={detailTabs} />
      </div>
      <div className="case-conversation"><div><h2>What could we build together?</h2><p>Have an idea that belongs out in the world?</p></div><ContactButton label="Let us talk" topic="project" /></div>
      <nav aria-label="More projects" className="case-next-projects">
        <Link href={previous.link} className="case-project-link"><div className="case-project-preview">{previousCover && <Image src={previousCover.src} alt="" fill unoptimized sizes="100px" style={{ objectFit: 'cover' }} />}</div><div><span><ArrowLeft size={12} aria-hidden="true" />Previous project</span><strong>{previous.title}</strong></div></Link>
        <Link href={next.link} className="case-project-link"><div className="case-project-preview">{nextCover && <Image src={nextCover.src} alt="" fill unoptimized sizes="100px" style={{ objectFit: 'cover' }} />}</div><div><span>Next project<ArrowRight size={12} aria-hidden="true" /></span><strong>{next.title}</strong></div><ArrowUpRight size={18} className="case-next-arrow" aria-hidden="true" /></Link>
      </nav>
    </article>
  </RouteShell>;
}

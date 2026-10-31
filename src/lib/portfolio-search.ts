import { projects } from '@/data/projects/projects';
import { workExperiences } from '@/data/experience/work-experience';

export interface SearchEntry {
  id: string; title: string; detail: string; href: string;
  kind: 'Page' | 'Project' | 'Experience' | 'PDF';
  keywords?: string; external?: boolean;
}
const entries: SearchEntry[] = [
  { id: 'home', title: 'Home', detail: 'Axel John Nuqui’s portfolio', href: '/', kind: 'Page', keywords: 'profile about axel xelpaxu' },
  { id: 'projects', title: 'Projects', detail: 'Browse all projects and technologies', href: '/projects', kind: 'Page' },
  { id: 'experience', title: 'Experience', detail: 'Work history and learning journey', href: '/experience', kind: 'Page', keywords: 'career jobs internship education' },
  { id: 'about', title: 'Get to know me', detail: 'A few quick answers from Axel', href: '/#about', kind: 'Page', keywords: 'about questions biography' },
  { id: 'contact', title: 'Get in touch', detail: 'Start a conversation', href: '/#contact', kind: 'Page', keywords: 'contact email hire work together' },
  { id: 'github', title: 'GitHub activity', detail: 'Contributions and repositories', href: '/#github', kind: 'Page', keywords: 'code social commits streak' },
  { id: 'resume', title: 'Resume', detail: 'Open Axel’s resume PDF in a new tab', href: '/NUQUI_CV.pdf', kind: 'PDF', keywords: 'cv curriculum vitae download', external: true },
  ...projects.map(project => ({ id: `project-${project.id}`, title: project.title, detail: project.description, href: project.link, kind: 'Project' as const, keywords: [project.category, ...project.tags, ...(project.notes ?? []), project.caseStudy?.goal, project.caseStudy?.audience].join(' ') })),
  ...workExperiences.map(role => ({ id: `role-${role.id}`, title: role.title, detail: role.role, href: `/experience#${role.id}`, kind: 'Experience' as const, keywords: [role.startDate, role.endDate, role.location, ...role.technologies, ...(role.notes ?? [])].join(' ') })),
];
const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

export function searchPortfolio(query: string): SearchEntry[] {
  const normalized = normalize(query);
  if (!normalized) return entries.slice(0, 7);
  const words = normalized.split(/\s+/);
  return entries.flatMap(entry => {
    const title = normalize(entry.title);
    const detail = normalize(entry.detail);
    const haystack = `${title} ${detail} ${normalize(entry.keywords ?? '')} ${entry.kind.toLowerCase()}`;
    if (!words.every(word => haystack.includes(word))) return [];
    const score = (title === normalized ? 100 : title.startsWith(normalized) ? 60 : title.includes(normalized) ? 40 : 0)
      + words.reduce((sum, word) => sum + (title.includes(word) ? 10 : detail.includes(word) ? 3 : 1), 0);
    return [{ entry, score }];
  }).sort((a, b) => b.score - a.score).slice(0, 12).map(result => result.entry);
}

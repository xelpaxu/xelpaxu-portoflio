import type { Project } from '@/types/project';

export interface ProjectLink { kind: 'github' | 'live' | 'video'; label: string; href: string }

function validUrl(value?: string) {
  if (!value || value.includes('yourusername')) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url : null;
  } catch { return null; }
}

function isYouTube(url: URL) {
  const host = url.hostname.toLowerCase();
  return host === 'youtu.be' || host === 'youtube.com' || host.endsWith('.youtube.com');
}

export function getProjectLinks(project: Pick<Project, 'github' | 'demo' | 'videoDemo'>): ProjectLink[] {
  const links: ProjectLink[] = [];
  const github = validUrl(project.github);
  const demo = validUrl(project.demo);
  const video = validUrl(project.videoDemo);
  if (github) links.push({ kind: 'github', label: 'View on GitHub', href: github.href });
  if (demo) links.push({ kind: isYouTube(demo) ? 'video' : 'live', label: isYouTube(demo) ? 'Watch demo' : 'Live demo', href: demo.href });
  if (video && !links.some(link => link.href === video.href)) links.push({ kind: 'video', label: 'Watch demo', href: video.href });
  return links;
}

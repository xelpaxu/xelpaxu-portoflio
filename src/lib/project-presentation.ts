import type { Project, ProjectImage } from '@/types/project';

export type ProjectPlatform = 'web' | 'mobile' | 'desktop' | 'mixed';
export type ImagePresentation = 'web' | 'mobile' | 'desktop' | 'artwork';
export const platformLabels: Record<ProjectPlatform, string> = { web: 'Web application', mobile: 'Mobile application', desktop: 'Desktop application', mixed: 'Web + mobile' };

export function getProjectPlatform(project: Pick<Project, 'category' | 'tags' | 'platform'>): ProjectPlatform {
  if (project.platform) return project.platform;
  const category = project.category?.toLowerCase() ?? '';
  const mobile = /mobile/.test(category) || project.tags.some(tag => /^(flutter|react native|expo|dart)$/i.test(tag));
  const web = /web|dashboard/.test(category) || project.tags.some(tag => /^(next\.js|react|javascript)$/i.test(tag));
  if (mobile && web) return 'mixed';
  if (mobile) return 'mobile';
  if (/desktop|game/.test(category) && !web) return 'desktop';
  return 'web';
}

export function getImagePresentation(image: ProjectImage, platform: ProjectPlatform, dimensions?: { width: number; height: number }): ImagePresentation {
  if (image.presentation) return image.presentation;
  if (/\.svg(?:\?|$)/i.test(image.src)) return 'artwork';
  const width = image.width ?? dimensions?.width;
  const height = image.height ?? dimensions?.height;
  if (width && height) {
    if (width / height < .85) return 'mobile';
    if (platform === 'mobile') return 'artwork';
    return platform === 'desktop' ? 'desktop' : 'web';
  }
  return platform === 'mixed' ? 'web' : platform;
}

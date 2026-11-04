import type { Project, ProjectImage } from '@/types/project';

export function getProjectImages(project: Pick<Project, 'images' | 'title' | 'imageLabel' | 'imageFit' | 'imagePosition'>): ProjectImage[] {
  return project.images.flatMap((image, index) => {
    const entry = typeof image === 'string' ? { src: image } : image;
    const src = entry.src.trim();
    if (!src) return [];
    return [{
      src,
      alt: 'alt' in entry ? entry.alt : `${project.title} - image ${index + 1}`,
      caption: 'caption' in entry ? entry.caption : project.imageLabel,
      fit: 'fit' in entry ? entry.fit : project.imageFit,
      position: 'position' in entry ? entry.position : project.imagePosition,
      presentation: 'presentation' in entry ? entry.presentation : undefined,
      width: 'width' in entry ? entry.width : undefined,
      height: 'height' in entry ? entry.height : undefined,
    }];
  });
}

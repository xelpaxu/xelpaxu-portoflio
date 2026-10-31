import type { Project } from '@/types/project';
import ProjectPreviewCard from './ProjectPreviewCard';

export default function ProjectCard(project: Project) {
  return <ProjectPreviewCard project={project} />;
}

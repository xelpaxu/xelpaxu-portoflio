// components/projects/ProjectsSection.tsx
"use client";

import { projects } from '../../data/projects/projects';
import ProjectCard from './ProjectCard';
import ScrollReveal from '../ScrollReveal';

export default function ProjectsSection() {
  // Get featured projects (first 3)
  const featuredProjects = projects.filter(p => p.featured === true).slice(0, 3);
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Projects Grid - 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayProjects.map((project, index) => (
          <ScrollReveal key={project.id} delay={0.1 * (index + 1)}>
            <ProjectCard {...project} />
          </ScrollReveal>
        ))}
      </div>

      {/* View All Link */}
      {projects.length > 3 && (
        <div className="mt-8 flex justify-center">
          <a
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 transition-all hover:text-zinc-300 hover:gap-3"
          >
            View all projects →
          </a>
        </div>
      )}
    </div>
  );
}
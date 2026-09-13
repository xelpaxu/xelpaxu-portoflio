// types/projects.ts

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  image: string;
  title: string;
  description: string;
  tags: string[];
  status: 'operational' | 'beta' | 'coming-soon' | 'archived';
  link: string;
  github?: string;
  demo?: string;
  featured?: boolean;
  metrics?: ProjectMetric[];
  notes?: string[];
}
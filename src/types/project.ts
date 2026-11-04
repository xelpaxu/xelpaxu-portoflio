// types/projects.ts

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectCaseStudy {
  overview: string[];
  audience: string;
  goal: string;
  features: { title: string; description: string }[];
  workflow: string[];
  technicalNotes: string[];
}

export interface ProjectImage {
  src: string;
  alt: string;
  caption?: string;
  fit?: 'cover' | 'contain';
  position?: string;
  presentation?: 'web' | 'mobile' | 'desktop' | 'artwork';
  width?: number;
  height?: number;
}

export interface Project {
  id: string;
  role?: string;
  platform?: 'web' | 'mobile' | 'desktop' | 'mixed';
  imageLabel?: string;
  imagePosition?: string;
  imageFit?: 'cover' | 'contain';
  images: (string | ProjectImage)[];
  category?: string;
  components?: { name: string; description: string; tags: string[]; github?: string }[];
  title: string;
  description: string;
  tags: string[];
  status: 'operational' | 'beta' | 'coming-soon' | 'archived' | 'project';
  link: string;
  github?: string;
  demo?: string;
  videoDemo?: string;
  caseStudy?: ProjectCaseStudy;
  featured?: boolean;
  metrics?: ProjectMetric[];
  notes?: string[];
}

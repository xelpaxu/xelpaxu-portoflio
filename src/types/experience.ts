export interface Journey {
  id: string;

  date: string;

  title: string;

  description: string;

  icon?: string;
}

export interface Experience {
  id: string;

  logo: string;

  title: string;

  role: string;

  startDate: string;
  endDate: string;

  location?: string;
  
  technologies: string[];

  description: string;

  notes?: string[];
}
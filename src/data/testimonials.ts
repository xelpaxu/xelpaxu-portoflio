export interface Testimonial {
  id: string;
  name: string;
  role: string;
  relationship: 'co-developer' | 'user';
  quote: string;
  projectId: string;
  featured?: boolean;
  image?: string;
  sample?: boolean;
}

// Replace these fictional samples with real feedback. Set sample to false when replaced.
// Images can be local paths under public/ (recommended) or full image URLs.
export const testimonials: Testimonial[] = [
  {
    id: 'vecpro-developer',
    name: 'Alex Rivera',
    role: 'Frontend developer - Sample profile',
    relationship: 'co-developer',
    quote: 'Working together felt straightforward. We could talk through an idea, split up the work, and help each other get the details right.',
    projectId: 'vecpro',
    featured: true,
    image: '/assets/testimonials/alex.svg',
    sample: true,
  },
    {
    id: 'vecpro-developerss',
    name: 'Alex Riveras',
    role: 'Frontend developer - Sample profile',
    relationship: 'co-developer',
    quote: 'Working together felt straightforward. We asdasdadasadasdscould talk through an idea, split up the work, and help each other get the details right.',
    projectId: 'vecpro',
    featured: true,
    image: '/assets/testimonials/alex.svg',
    sample: true,
  },
  {
    id: 'vecpro-user',
    name: 'Sam Reyes',
    role: 'Project tester - Sample profile',
    relationship: 'user',
    quote: 'The layout made it easy to find my way around. I could understand the main features without needing someone to walk me through each step.',
    projectId: 'vecpro',
    image: '/assets/testimonials/sam.svg',
    sample: true,
  }
];

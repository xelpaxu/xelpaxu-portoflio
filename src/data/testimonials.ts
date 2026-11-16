export interface Testimonial {
  id: string;
  name: string;
  role: string;
  relationship: 'co-developer' | 'user' | 'teacher' | 'professor';
  quote: string;
  projectId: string | string[];
  featured?: boolean;
  image?: string;
  sample?: boolean;
}

export const testimonialRelationshipLabels: Record<Testimonial['relationship'], string> = {
  'co-developer': 'Co-developer',
  user: 'User',
  teacher: 'Teacher',
  professor: 'Professor',
};

// Mark fictional sample entries with sample: true.
// Images can be local paths under public/ (recommended) or full image URLs.
export const testimonials: Testimonial[] = [
  {
    id: 'sirralph-prof',
    name: 'Ralph Voltaire J. Dayot',
    role: 'Division Chair - CS | Prof and Research Adviser',
    relationship: 'professor',
    quote: "Axel is a dedicated researcher and adept programmer who consistently demonstrates strong technical mastery and work ethic. Throughout his coursework and research under my supervision, he has stood out for his diligence, proactive communication, and ability to solve complex problems independently.",
    projectId: ['vecpro'],
    featured: true,
    image: '/assets/testimonials/sir-ralph.jpg',
  },
  {
    id: 'joelmar-dev',
    name: 'Joelmar D. Grecia',
    role: 'Frontend developer',
    relationship: 'co-developer',
    quote: "Working with Axel has been a great experience. He can handle tasks no matter how complex they are while managing multiple projects without compromising the quality of his work. What I appreciate most is his willingness to involve his teammates, discuss ideas, and explain technical concepts to make sure everyone understands and learns along the way. He's someone I can rely on not only to get things done but also to help the team grow and deliver quality results.",
    projectId: ['vecpro', 'amogus', 'encast', 'memowee'],
    featured: true,
    image: '/assets/testimonials/joelm.png',
  },
];

// Accept single IDs, arrays, and legacy comma-separated entries.
export function getTestimonialProjectIds(testimonial: Testimonial): string[] {
  const values = Array.isArray(testimonial.projectId) ? testimonial.projectId : [testimonial.projectId];
  return [...new Set(values.flatMap(value => value.split(',')).map(id => id.trim()).filter(Boolean))];
}

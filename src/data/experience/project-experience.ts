import type { Experience } from '@/types/experience';

// Keep dates blank until the actual project timelines are confirmed.
export const projectExperiences: Experience[] = [
  {
    id: 'vecpro-aedify',
    logo: '/assets/logos/aedify.png',
    title: 'VECPRO (Aedify)',
    role: 'Full-stack developer',
    startDate: '', endDate: '',
    technologies: ['Next.js', 'React', 'TypeScript', 'Convex'],
    description: 'Built the web side of our thesis project, turning mosquito breeding-site reports from the field into a workspace for surveillance and follow-up.',
    notes: [
      'Connected the dashboard to Aedex through Convex so field reports could move into a shared review and response workflow.',
      'Brought report evidence, geographic context, and validation information together for surveillance staff.',
      'Developed mapping, assignments, and analytics views to connect incoming observations with follow-up work.',
    ],
  },
  {
    id: 'vecpro-aedex',
    logo: '/assets/logos/aedex.png',
    title: 'VECPRO (Aedex)',
    role: 'Full-stack developer',
    startDate: '', endDate: '',
    technologies: ['React Native', 'Expo', 'TypeScript', 'Convex'],
    description: 'Built the mobile reporting side of VECPRO, connecting photo evidence and site locations to the same incident lifecycle used by the web dashboard.',
    notes: [
      'Implemented camera and gallery capture flows for documenting suspected mosquito breeding sites.',
      'Kept photos, coordinates, assessment information, and report history connected in the mobile incident views.',
      'Developed responder workflows for reviewing assigned incidents and recording breeding-site resolution.',
    ],
  },
  {
    id: 'mabuh-ai',
    logo: '',
    title: 'Mabuh-AI',
    role: 'AI chatbot feature developer',
    startDate: '', endDate: '',
    technologies: ['React', 'Tauri'],
    description: 'Developed the AI chatbot feature of a mobile app built with React and packaged through Tauri.',
    notes: [
      'Built the chatbot interface in React and integrated the AI conversation feature into the mobile app.',
      'Worked within the Tauri application setup to bring the React-based chat experience into the packaged app.',
    ],
  },
  {
    id: 'visaia-mobile',
    logo: '/assets/projects/visaia.svg',
    title: 'VISAIA (Mobile app)',
    role: 'Full-stack developer',
    startDate: '', endDate: '',
    technologies: ['Flutter', 'Dart', 'Firebase', 'GitHub Actions'],
    description: 'Built a mobile farm-management and pest-monitoring app, and created a basic GitHub Actions CI pipeline to automate app updates.',
    notes: [
      'Connected farm and field mapping with crop growing cycles, keeping activity records tied to the relevant growing cycle.',
      'Implemented image-based pest scouting alongside photos, observations, and farm records.',
      'Set up a basic CI workflow with GitHub Actions for automatic updates, reducing the manual steps involved in distributing changes.',
    ],
  },
];

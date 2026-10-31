import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import RouteShell from '@/components/RouteShell';
import ExperienceArchive from '@/components/experience/ExperienceArchive';

export const metadata: Metadata = {
  title: 'Experience | Axel John Nuqui',
  description: 'Work experience and the learning journey of Axel John Nuqui.',
};
export default function ExperiencePage() {
  return <RouteShell>
    <PageHeader title="Experience" description="Frontend, full-stack, and product development. The teams I have worked with and what I contributed along the way." />
    <ExperienceArchive />
  </RouteShell>;
}

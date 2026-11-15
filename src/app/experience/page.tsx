import type { Metadata } from 'next';
import { experienceLabel, experienceDescription } from '@/data/experience/experience';
import PageHeader from '@/components/PageHeader';
import RouteShell from '@/components/RouteShell';
import ExperienceArchive from '@/components/experience/ExperienceArchive';

export const metadata: Metadata = {
  title: `${experienceLabel} | Axel John Nuqui`,
  description: `${experienceLabel} and the learning journey of Axel John Nuqui.`,
};
export default function ExperiencePage() {
  return <RouteShell>
    <PageHeader title={experienceLabel} description={experienceDescription} />
    <ExperienceArchive />
  </RouteShell>;
}

import { notFound, redirect } from 'next/navigation';
import { workExperiences } from '@/data/experience/work-experience';

// Keep old role links working while all content lives on the experience page.
export default async function ExperienceRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!workExperiences.some(role => role.id === slug)) notFound();
  redirect(`/experience#${slug}`);
}

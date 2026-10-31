import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import RouteShell from '@/components/RouteShell';
import ProjectExplorer from '@/components/projects/ProjectExplorer';

export const metadata: Metadata = {
  title: 'Projects | Axel John Nuqui',
  description: 'Projects and work across different technologies and domains.',
};

export default function ProjectsPage() {
  return (
    <RouteShell>
      <PageHeader title="Projects" description="Ideas turned into things you can use. A collection of web experiences, developer tools, and experiments." />
      <ProjectExplorer />
    </RouteShell>
  );
}

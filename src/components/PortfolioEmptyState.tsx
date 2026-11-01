import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function PortfolioEmptyState({ kind }: { kind: 'projects' | 'experience' }) {
  return (
    <div className="border-y border-line px-4 py-12 text-center sm:py-16">
      <h3 className="text-base font-medium text-foreground">
        {kind === 'projects' ? 'No projects to share yet' : 'No work experience to share yet'}
      </h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
        {kind === 'projects' ? 'Future projects will find a home here.' : 'The next chapter starts with an opportunity.'}
      </p>
      <Link href="/#contact" className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground">
        Get in touch<ArrowUpRight className="size-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

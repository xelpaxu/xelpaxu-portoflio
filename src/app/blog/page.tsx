/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, NotebookPen } from 'lucide-react';
import RouteShell from '@/components/RouteShell';
import PageHeader from '@/components/PageHeader';
import BlogStudio from '@/components/blog/BlogStudio';
import { blogs } from '@/data/blogs';
import { blogDate, readingMinutes } from '@/lib/blog-content';

export const metadata: Metadata = { title: 'Blog | Axel John Nuqui', description: 'Notes on building, learning, and the details in between.' };
export default function BlogPage() {
  const posts = blogs.filter(post => post.status === 'published').sort((a, b) => (b.publishedAt ?? b.createdAt).localeCompare(a.publishedAt ?? a.createdAt));
  return <RouteShell>
    <PageHeader title="Blog" description="Notes on building, learning, and the details in between. A little space for things worth sharing." />
    {process.env.NODE_ENV === 'development' && <BlogStudio />}
    {!posts.length ? <div className="mx-auto max-w-2xl border-y border-line py-14 text-center"><NotebookPen className="mx-auto mb-4 size-6 text-subtle" aria-hidden="true" /><h2 className="text-xl font-medium tracking-tight">A few thoughts, coming soon.</h2><p className="mt-3 text-sm leading-7 text-muted">Stories, experiments, and lessons from the things I build.</p></div> : <div className="mx-auto max-w-4xl divide-y divide-line border-y border-line">
      {posts.map(post => <article key={post.id} className="group py-8 sm:py-10"><Link href={`/blog/${post.slug}`} className={`grid gap-5 ${post.cover ? 'sm:grid-cols-[minmax(0,1fr)_220px] sm:items-center sm:gap-10' : ''}`}>
        <div className="min-w-0"><div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-subtle"><time dateTime={post.publishedAt ?? post.createdAt}>{blogDate(post.publishedAt ?? post.createdAt)}</time><span>{readingMinutes(post)} min read</span></div><h2 className="text-2xl font-semibold tracking-tight text-strong transition-colors group-hover:text-accent sm:text-3xl">{post.title}</h2>{post.excerpt && <p className="mt-3 text-sm leading-7 text-muted">{post.excerpt}</p>}<div className="mt-5 flex flex-wrap items-center gap-3">{post.tags.map(tag => <span key={tag} className="text-[11px] text-subtle">{tag}</span>)}<span className="ml-auto inline-flex items-center gap-1 text-xs text-accent">Read story<ArrowUpRight className="size-3.5" aria-hidden="true" /></span></div></div>
        {post.cover && <img src={post.cover} alt={post.coverAlt ?? ''} className="aspect-[16/10] w-full rounded-xl border border-line object-cover" loading="lazy" />}
      </Link></article>)}
    </div>}
  </RouteShell>;
}

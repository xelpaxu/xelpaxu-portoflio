/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import RouteShell from '@/components/RouteShell';
import BlogBody from '@/components/blog/BlogBody';
import { blogs } from '@/data/blogs';
import { blogDate, readingMinutes } from '@/lib/blog-content';

export function generateStaticParams() { return blogs.filter(post => post.status === 'published').map(post => ({ slug: post.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogs.find(item => item.slug === slug && item.status === 'published');
  return { title: `${post?.title ?? 'Post not found'} | Axel John Nuqui`, description: post?.excerpt };
}
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = blogs.filter(item => item.status === 'published').sort((a, b) => (b.publishedAt ?? b.createdAt).localeCompare(a.publishedAt ?? a.createdAt));
  const index = posts.findIndex(item => item.slug === slug);
  if (index === -1) notFound();
  const post = posts[index];
  const next = posts[index + 1];
  return <RouteShell>
    <div className="mx-auto max-w-3xl">
      <Link href="/blog" className="mb-9 inline-flex min-h-11 items-center gap-2 text-xs text-muted hover:text-accent"><ArrowLeft className="size-3.5" />All stories</Link>
      <article>
        <header className="mb-9"><div className="mb-4 flex flex-wrap gap-x-3 gap-y-1 text-xs text-subtle"><time dateTime={post.publishedAt ?? post.createdAt}>{blogDate(post.publishedAt ?? post.createdAt)}</time><span>{readingMinutes(post)} min read</span></div><h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">{post.title}</h1>{post.excerpt && <p className="mt-5 text-base leading-8 text-muted">{post.excerpt}</p>}<div className="mt-6 flex flex-wrap items-center gap-4 text-xs"><span className="text-strong">Axel John Nuqui</span>{post.tags.map(tag => <span key={tag} className="text-subtle">{tag}</span>)}</div></header>
        {post.cover && <img src={post.cover} alt={post.coverAlt ?? ''} className="mb-10 aspect-[16/10] w-full rounded-2xl border border-line object-cover" />}
        <BlogBody content={post.content} />
      </article>
      <nav aria-label="More stories" className="mt-14 flex flex-wrap justify-between gap-5 border-t border-line pt-6"><Link href="/blog" className="inline-flex min-h-11 items-center gap-2 text-xs text-muted"><ArrowLeft className="size-3.5" />Back to blog</Link>{next && <Link href={`/blog/${next.slug}`} className="inline-flex min-h-11 items-center gap-2 text-xs text-accent">{next.title}<ArrowRight className="size-3.5" /></Link>}</nav>
    </div>
  </RouteShell>;
}

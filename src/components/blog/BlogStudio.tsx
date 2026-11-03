'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { Pencil, Plus } from 'lucide-react';
import type { BlogPost } from '@/types/blog';
const BlogEditor = dynamic(() => import('./BlogEditor'), { ssr: false, loading: () => <p className="py-6 text-sm text-muted">Opening your studio...</p> });

export default function BlogStudio() {
  const [open, setOpen] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [revision, setRevision] = useState('');
  const [post, setPost] = useState<BlogPost | undefined>();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const newPostButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'a' && !event.repeat && !target.closest('input, textarea, select, [contenteditable="true"], [role="textbox"]')) {
        event.preventDefault();
        setOpen(true);
        if (!newPostButton.current?.disabled) newPostButton.current?.click();
        root.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    window.addEventListener('keydown', keydown);
    return () => window.removeEventListener('keydown', keydown);
  }, []);
  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    fetch('/api/blog/local/posts', { signal: controller.signal, cache: 'no-store' }).then(async response => {
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Could not open the blog file.');
      setPosts(result.posts); setRevision(result.revision); setError('');
    }).catch(error => { if (!controller.signal.aborted) setError(error.message); });
    return () => controller.abort();
  }, [open]);
  async function start(selected?: BlogPost) {
    setLoading(true); setError(''); setNotice('');
    try {
      const response = await fetch('/api/blog/local/posts', { cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Could not read the blog file.');
      setPosts(result.posts); setRevision(result.revision);
      setPost(selected ? result.posts.find((item: BlogPost) => item.id === selected.id) : undefined);
      setEditing(true); setOpen(true);
    } catch (error) { setError(error instanceof Error ? error.message : 'Could not open editor.'); }
    finally { setLoading(false); }
  }
  return <div ref={root} className="mb-8 scroll-mt-28">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-line px-4 py-3">
      <span className="text-xs text-muted">Local writing mode <span className="ml-2 text-subtle">Ctrl + A</span></span>
      <div className="flex gap-3"><button type="button" onClick={() => setOpen(value => !value)} className="min-h-11 text-xs text-muted">{open ? 'Hide posts' : 'Manage posts'}</button><button ref={newPostButton} type="button" disabled={loading || editing} onClick={() => void start()} className="inline-flex min-h-11 items-center gap-2 text-xs text-accent disabled:opacity-40"><Plus className="size-4" />New post</button></div>
    </div>
    {(error || notice) && <p role="status" className="mb-4 text-sm leading-7 text-muted">{error || notice}</p>}
    {editing && <BlogEditor key={post?.id ?? 'new'} post={post} revision={revision} onClose={() => setEditing(false)} onSave={result => {
      setPosts(result.posts); setRevision(result.revision); setEditing(false);
      setNotice(result.post.status === 'published' ? 'Saved to blogs.ts. Commit the post and its images to publish with your next deployment.' : 'Draft saved to blogs.ts. It will stay off the public blog.');
    }} />}
    {open && !editing && <div className="mb-8 divide-y divide-line border-y border-line">
      {!posts.length && <p className="py-5 text-sm text-muted">Your notebook is empty. Create your first post above.</p>}
      {posts.map(item => <div key={item.id} className="flex items-center justify-between gap-4 py-4"><div className="min-w-0"><p className="truncate text-sm font-medium text-strong">{item.title}</p><p className="mt-1 text-[11px] text-subtle">{item.status === 'draft' ? 'Draft' : 'Published locally'} /blog/{item.slug}</p></div><button type="button" disabled={loading} onClick={() => void start(item)} className="inline-flex min-h-11 shrink-0 items-center gap-2 px-2 text-xs text-accent"><Pencil className="size-3.5" />Edit</button></div>)}
    </div>}
  </div>;
}

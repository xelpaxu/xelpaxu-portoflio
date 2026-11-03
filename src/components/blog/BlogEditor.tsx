'use client';

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useEditor, EditorContent, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import { Bold, Italic, Underline, List, ListOrdered, Quote, Code, ImagePlus, Link as LinkIcon, Undo2, Redo2, Eye, Pencil, X, Save, Upload } from 'lucide-react';
import type { BlogNode, BlogPost } from '@/types/blog';
import { blogFontSize, safeBlogUrl } from '@/lib/blog-content';
import BlogBody from './BlogBody';
import { FontSize } from './FontSize';

export type BlogDraft = Pick<BlogPost, 'title' | 'slug' | 'excerpt' | 'tags' | 'cover' | 'coverAlt' | 'status' | 'content'> & { id?: string };
const emptyContent: BlogNode = { type: 'doc', content: [{ type: 'paragraph' }] };
const slugify = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 100);
const field = 'w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm text-foreground placeholder:text-subtle';

export default function BlogEditor({ post, revision, onSave, onClose }: {
  post?: BlogPost; revision: string;
  onSave: (result: { post: BlogPost; posts: BlogPost[]; revision: string }) => void;
  onClose: () => void;
}) {
  const storageKey = `portfolio-blog-draft:${post?.id ?? 'new'}`;
  const [draft, setDraft] = useState<BlogDraft>(() => {
    try {
      const restored = JSON.parse(localStorage.getItem(storageKey) ?? 'null');
      if (restored && restored.draft && restored.baseUpdatedAt === (post?.updatedAt ?? null)) return restored.draft;
    } catch { /* Browser storage is optional. */ }
    return post ?? { title: '', slug: '', excerpt: '', tags: [], cover: '', coverAlt: '', status: 'draft', content: emptyContent };
  });
  const [preview, setPreview] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [linkOpen, setLinkOpen] = useState(false);
  const [link, setLink] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [tagText, setTagText] = useState(draft.tags.join(', '));
  const coverInput = useRef<HTMLInputElement>(null);
  const imageInput = useRef<HTMLInputElement>(null);
  const titleInput = useRef<HTMLInputElement>(null);
  const editor = useEditor({
    extensions: [FontSize, StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false } }), ImageExtension.configure({ allowBase64: false })],
    immediatelyRender: false,
    content: draft.content,
    editorProps: { attributes: { class: 'blog-prose min-h-72 px-5 py-6 sm:px-8', 'aria-label': 'Article body', role: 'textbox', 'aria-multiline': 'true' } },
    onUpdate: ({ editor }) => { setDraft(value => ({ ...value, content: editor.getJSON() as BlogNode })); setDirty(true); },
  });
  const format = useEditorState({ editor, selector: ({ editor }) => ({
    bold: editor?.isActive('bold') ?? false, italic: editor?.isActive('italic') ?? false,
    underline: editor?.isActive('underline') ?? false, bullet: editor?.isActive('bulletList') ?? false,
    ordered: editor?.isActive('orderedList') ?? false, quote: editor?.isActive('blockquote') ?? false,
    code: editor?.isActive('codeBlock') ?? false, link: editor?.isActive('link') ?? false,
    fontSize: blogFontSize(editor?.getAttributes('fontSize').size),
    size: editor?.isActive('heading', { level: 2 }) ? 'large' : editor?.isActive('heading', { level: 3 }) ? 'medium' : 'body',
  }) });

  useEffect(() => { titleInput.current?.focus(); }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      try { localStorage.setItem(storageKey, JSON.stringify({ draft, baseUpdatedAt: post?.updatedAt ?? null })); } catch { /* Saving to the source file still works. */ }
    }, 350);
    return () => clearTimeout(timer);
  }, [draft, storageKey, post?.updatedAt]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  function change(patch: Partial<BlogDraft>) { setDraft(value => ({ ...value, ...patch })); setDirty(true); }
  function close() { if (!dirty || window.confirm('Close the editor? Your working copy will stay in this browser.')) onClose(); }
  async function upload(event: ChangeEvent<HTMLInputElement>, cover: boolean) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type) || file.size > 5 * 1024 * 1024) { setMessage('Choose a PNG, JPEG, WebP, or GIF under 5 MB.'); input.value = ''; return; }
    setUploading(true); setMessage('');
    try {
      const form = new FormData(); form.set('image', file);
      const response = await fetch('/api/blog/local/upload', { method: 'POST', body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Upload failed.');
      if (cover) change({ cover: result.url });
      else { editor?.chain().focus().setImage({ src: result.url, alt: imageAlt, title: imageCaption }).run(); setImageAlt(''); setImageCaption(''); }
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Upload failed.'); }
    finally { setUploading(false); input.value = ''; }
  }
  async function save(status: BlogPost['status']) {
    if (busy || uploading) return;
    setBusy(true); setMessage('');
    try {
      const response = await fetch('/api/blog/local/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ revision, post: { ...draft, status } }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Save failed.');
      setDirty(false);
      try { localStorage.removeItem(storageKey); } catch { /* Optional storage. */ }
      onSave(result);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Save failed. Your text is still here.'); }
    finally { setBusy(false); }
  }
  if (!editor) return <p className="py-8 text-sm text-muted">Opening your editor...</p>;
  const toolbarButton = 'flex size-11 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-surface-raised hover:text-foreground aria-pressed:bg-accent/10 aria-pressed:text-accent';
  return <section aria-label="Local blog editor" className="mb-12 border-y border-line py-6">
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div><p className="text-[11px] font-medium uppercase tracking-[.15em] text-accent">Local studio</p><h2 className="mt-1 text-xl font-semibold tracking-tight">{post ? 'Edit your story' : 'A new story starts here'}</h2></div>
      <div className="flex items-center gap-1">
        <button type="button" onClick={() => setPreview(value => !value)} className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-xs text-muted hover:bg-surface"><span aria-hidden="true">{preview ? <Pencil className="size-4" /> : <Eye className="size-4" />}</span>{preview ? 'Write' : 'Preview'}</button>
        <button type="button" onClick={close} aria-label="Close editor" className={toolbarButton} disabled={busy}><X className="size-4" /></button>
      </div>
    </header>
    <div className="mt-6 grid gap-7 lg:grid-cols-[minmax(0,1fr)_250px]">
      <div className="min-w-0">
        <label htmlFor="blog-title" className="mb-2 block text-xs text-muted">Title</label>
        <input id="blog-title" ref={titleInput} value={draft.title} maxLength={160} placeholder="Give your story a title" onChange={event => { const title = event.target.value; change({ title, ...(!post && (!draft.slug || draft.slug === slugify(draft.title)) ? { slug: slugify(title) } : {}) }); }} className={`${field} text-xl font-medium`} />
        {preview ? <article className="mt-6 rounded-xl border border-line bg-page p-5 sm:p-8"><h2 className="mb-6 text-3xl font-semibold tracking-tight">{draft.title || 'Untitled story'}</h2>{draft.excerpt && <p className="mb-6 text-sm leading-7 text-muted">{draft.excerpt}</p>}{draft.cover && <img src={draft.cover} alt={draft.coverAlt ?? ''} className="mb-8 w-full rounded-xl" />}<BlogBody content={draft.content} /></article> : <div className="mt-5 rounded-xl border border-line bg-page">
          <div role="toolbar" aria-label="Text formatting" className="sticky top-24 z-20 flex flex-wrap items-center gap-0.5 rounded-t-xl border-b border-line bg-surface p-1.5" onMouseDown={event => { if ((event.target as HTMLElement).closest('button')) event.preventDefault(); }}>
            <label className="sr-only" htmlFor="blog-size">Paragraph style</label>
            <select id="blog-size" value={format?.size ?? 'body'} onChange={event => { const chain = editor.chain().focus(); if (event.target.value === 'large') chain.setHeading({ level: 2 }).run(); else if (event.target.value === 'medium') chain.setHeading({ level: 3 }).run(); else chain.setParagraph().run(); }} className="h-11 rounded-lg bg-transparent px-2 text-xs text-strong"><option value="body">Body</option><option value="medium">Medium heading</option><option value="large">Large heading</option></select>
            <label className="inline-flex h-11 items-center gap-1 rounded-lg border border-line px-2 text-xs text-muted">
              <span className="sr-only">Font size in pixels</span>
              <input key={format?.fontSize ?? 'default'} type="number" min={12} max={64} step={1} list="blog-font-sizes" defaultValue={format?.fontSize ?? ''} placeholder="Auto" aria-label="Font size in pixels" className="w-12 bg-transparent text-center text-strong" onBlur={event => {
                if (!event.target.value) { editor.chain().focus().unsetMark('fontSize').run(); return; }
                const size = blogFontSize(event.target.value);
                if (!size) { setMessage('Choose a font size from 12 to 64 px.'); return; }
                editor.chain().focus().setMark('fontSize', { size }).run();
              }} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); event.currentTarget.blur(); } }} />
              <span>px</span>
            </label>
            <datalist id="blog-font-sizes">{[12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 56, 64].map(size => <option key={size} value={size} />)}</datalist>
            <button type="button" title="Reset font size" aria-label="Reset font size" onClick={() => editor.chain().focus().unsetMark('fontSize').run()} className={toolbarButton}>Aa</button>
            <button type="button" title="Bold (Ctrl+B)" aria-label="Bold" aria-pressed={format?.bold} onClick={() => editor.chain().focus().toggleBold().run()} className={toolbarButton}><Bold className="size-4" /></button>
            <button type="button" title="Italic (Ctrl+I)" aria-label="Italic" aria-pressed={format?.italic} onClick={() => editor.chain().focus().toggleItalic().run()} className={toolbarButton}><Italic className="size-4" /></button>
            <button type="button" title="Underline (Ctrl+U)" aria-label="Underline" aria-pressed={format?.underline} onClick={() => editor.chain().focus().toggleUnderline().run()} className={toolbarButton}><Underline className="size-4" /></button>
            <button type="button" title="Bullet list" aria-label="Bullet list" aria-pressed={format?.bullet} onClick={() => editor.chain().focus().toggleBulletList().run()} className={toolbarButton}><List className="size-4" /></button>
            <button type="button" title="Numbered list" aria-label="Numbered list" aria-pressed={format?.ordered} onClick={() => editor.chain().focus().toggleOrderedList().run()} className={toolbarButton}><ListOrdered className="size-4" /></button>
            <button type="button" title="Quote" aria-label="Quote" aria-pressed={format?.quote} onClick={() => editor.chain().focus().toggleBlockquote().run()} className={toolbarButton}><Quote className="size-4" /></button>
            <button type="button" title="Code block" aria-label="Code block" aria-pressed={format?.code} onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={toolbarButton}><Code className="size-4" /></button>
            <button type="button" title="Link" aria-label="Edit link" aria-pressed={format?.link} onClick={() => { setLink(String(editor.getAttributes('link').href ?? '')); setLinkOpen(value => !value); }} className={toolbarButton}><LinkIcon className="size-4" /></button>
            <button type="button" title="Insert image" aria-label="Insert image" disabled={uploading} onClick={() => imageInput.current?.click()} className={toolbarButton}><ImagePlus className="size-4" /></button>
            <button type="button" title="Undo" aria-label="Undo" onClick={() => editor.chain().focus().undo().run()} className={toolbarButton}><Undo2 className="size-4" /></button>
            <button type="button" title="Redo" aria-label="Redo" onClick={() => editor.chain().focus().redo().run()} className={toolbarButton}><Redo2 className="size-4" /></button>
          </div>
          {linkOpen && <div className="flex flex-wrap gap-2 border-b border-line p-3"><label className="sr-only" htmlFor="blog-link">Link URL</label><input id="blog-link" value={link} onChange={event => setLink(event.target.value)} placeholder="https://..." className={`${field} min-w-0 flex-1`} /><button type="button" className="min-h-11 px-2 text-xs text-accent" onClick={() => { const href = safeBlogUrl(link); if (!href) { setMessage('Use an HTTPS, HTTP, or local link.'); return; } editor.chain().focus().extendMarkRange('link').setLink({ href }).run(); setLinkOpen(false); }}>Apply</button><button type="button" className="min-h-11 px-2 text-xs text-muted" onClick={() => { editor.chain().focus().unsetLink().run(); setLinkOpen(false); }}>Remove</button></div>}
          <EditorContent editor={editor} />
        </div>}
        <div className="mt-3 flex flex-wrap justify-between gap-2 text-[11px] text-subtle"><span>Working copy stays in this browser until saved.</span><span>{draft.content.content?.length ?? 0} blocks</span></div>
      </div>
      <aside className="space-y-5" aria-label="Post settings">
        <div><label htmlFor="blog-slug" className="mb-2 block text-xs text-muted">Post URL</label><div className="mb-1 text-[10px] text-subtle">/blog/</div><input id="blog-slug" value={draft.slug} maxLength={100} onChange={event => change({ slug: slugify(event.target.value) })} className={field} /></div>
        <div><label htmlFor="blog-excerpt" className="mb-2 block text-xs text-muted">Short description</label><textarea id="blog-excerpt" value={draft.excerpt} maxLength={400} rows={3} onChange={event => change({ excerpt: event.target.value })} className={field} /></div>
        <div><label htmlFor="blog-tags" className="mb-2 block text-xs text-muted">Tags, separated by commas</label><input id="blog-tags" value={tagText} onChange={event => { setTagText(event.target.value); change({ tags: event.target.value.split(',').map(tag => tag.trim()).filter(Boolean) }); }} placeholder="Development, design" className={field} /></div>
        <div><p className="mb-2 text-xs text-muted">Cover image</p>{draft.cover && <img src={draft.cover} alt={draft.coverAlt ?? ''} className="mb-2 aspect-[16/10] w-full rounded-lg border border-line object-cover" />}<button type="button" disabled={uploading} onClick={() => coverInput.current?.click()} className="inline-flex min-h-11 items-center gap-2 text-xs text-accent"><Upload className="size-4" />{uploading ? 'Uploading...' : draft.cover ? 'Replace cover' : 'Upload cover'}</button>{draft.cover && <button type="button" onClick={() => change({ cover: '', coverAlt: '' })} className="ml-3 min-h-11 text-xs text-muted">Remove</button>}<label htmlFor="blog-cover-alt" className="mb-2 block text-xs text-muted">Cover description</label><input id="blog-cover-alt" value={draft.coverAlt ?? ''} onChange={event => change({ coverAlt: event.target.value })} placeholder="Describe the cover image" className={field} /></div>
        <div className="border-t border-line pt-5"><p className="mb-3 text-xs font-medium text-strong">Insert an article image</p><label htmlFor="blog-image-alt" className="mb-2 block text-xs text-muted">Image description</label><input id="blog-image-alt" value={imageAlt} onChange={event => setImageAlt(event.target.value)} className={field} /><label htmlFor="blog-image-caption" className="mb-2 mt-3 block text-xs text-muted">Caption (optional)</label><input id="blog-image-caption" value={imageCaption} onChange={event => setImageCaption(event.target.value)} className={field} /><button type="button" disabled={uploading} onClick={() => imageInput.current?.click()} className="mt-2 inline-flex min-h-11 items-center gap-2 text-xs text-accent"><ImagePlus className="size-4" />Choose image</button></div>
      </aside>
    </div>
    <input ref={coverInput} type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden onChange={event => void upload(event, true)} />
    <input ref={imageInput} type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden onChange={event => void upload(event, false)} />
    <footer className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
      <p role="status" className="max-w-lg text-xs leading-6 text-muted">{message || (busy ? 'Saving to your blog file...' : uploading ? 'Uploading image...' : 'Save locally, then commit and deploy when you are ready.')}</p>
      <div className="flex gap-2"><button type="button" disabled={busy || uploading} onClick={() => void save('draft')} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-xs text-strong disabled:opacity-50"><Save className="size-3.5" />Save draft</button><button type="button" disabled={busy || uploading} onClick={() => void save('published')} className="min-h-11 rounded-full bg-accent px-5 text-xs font-medium text-accent-ink disabled:opacity-50">{post?.status === 'published' ? 'Save changes' : 'Publish locally'}</button></div>
    </footer>
  </section>;
}

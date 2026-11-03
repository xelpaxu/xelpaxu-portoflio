import { createHash, randomUUID } from 'node:crypto';
import { readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { BlogNode, BlogPost } from '@/types/blog';
import { blogFontSize, blogText, safeBlogUrl } from '@/lib/blog-content';

export class BlogError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
export function allowLocalBlog(request: Request, write = false) {
  if (process.env.NODE_ENV !== 'development') return false;
  const host = request.headers.get('host');
  if (!host || !/^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host)) return false;
  if (write) {
    const origin = request.headers.get('origin');
    if (!origin || origin !== new URL(request.url).origin || new URL(origin).host !== host) return false;
  }
  return true;
}
const file = () => path.join(process.cwd(), 'src/data/blogs.ts');
const revisionOf = (text: string) => createHash('sha256').update(text).digest('hex');
export async function readLocalBlogs() {
  const source = await readFile(file(), 'utf8');
  const match = source.match(/export const blogs: BlogPost\[\] = ([\s\S]*);\s*$/);
  if (!match) throw new BlogError('Keep the blogs export in its original format. See BLOG.md.', 409);
  let posts: BlogPost[];
  try { posts = JSON.parse(match[1]); }
  catch { throw new BlogError('The editor needs JSON-compatible post values. See BLOG.md.', 409); }
  if (!Array.isArray(posts)) throw new BlogError('Invalid blogs array.', 409);
  return { posts, revision: revisionOf(source) };
}
const nodes = new Set(['doc', 'paragraph', 'heading', 'text', 'bulletList', 'orderedList', 'listItem', 'blockquote', 'codeBlock', 'hardBreak', 'horizontalRule', 'image']);
function validateContent(input: unknown): BlogNode {
  let total = 0;
  const visit = (value: unknown, depth: number): BlogNode => {
    if (++total > 12000 || depth > 20 || !value || typeof value !== 'object') throw new BlogError('The article is too large or invalid.');
    const node = value as BlogNode;
    if (!nodes.has(node.type)) throw new BlogError('Unsupported article formatting.');
    const clean: BlogNode = { type: node.type };
    if (node.type === 'text') {
      if (typeof node.text !== 'string' || node.text.length > 100000) throw new BlogError('Invalid article text.');
      clean.text = node.text;
    }
    if (node.content) {
      if (!Array.isArray(node.content)) throw new BlogError('Invalid article blocks.');
      clean.content = node.content.map(child => visit(child, depth + 1));
    }
    if (node.type === 'heading') clean.attrs = { level: node.attrs?.level === 3 ? 3 : 2 };
    if (node.type === 'orderedList') clean.attrs = { start: Number.isSafeInteger(node.attrs?.start) ? Math.max(1, Number(node.attrs?.start)) : 1 };
    if (node.type === 'image') {
      const src = safeBlogUrl(node.attrs?.src, true);
      if (!src) throw new BlogError('Use a local image or an HTTPS image URL.');
      clean.attrs = { src, alt: String(node.attrs?.alt ?? '').slice(0, 500), title: String(node.attrs?.title ?? '').slice(0, 500) };
    }
    if (node.marks) {
      if (!Array.isArray(node.marks) || node.marks.length > 8) throw new BlogError('Invalid text formatting.');
      clean.marks = node.marks.flatMap(mark => {
        if (['bold', 'italic', 'underline', 'strike', 'code'].includes(mark.type)) return [{ type: mark.type }];
        if (mark.type === 'fontSize') {
          const size = blogFontSize(mark.attrs?.size);
          if (!size) throw new BlogError('Choose a font size from 12 to 64 px.');
          return [{ type: 'fontSize', attrs: { size } }];
        }
        if (mark.type === 'link') {
          const href = safeBlogUrl(mark.attrs?.href);
          if (!href) throw new BlogError('Use an HTTPS, HTTP, or local link.');
          return [{ type: 'link', attrs: { href } }];
        }
        return [];
      });
    }
    return clean;
  };
  const content = visit(input, 0);
  if (content.type !== 'doc') throw new BlogError('Invalid article document.');
  return content;
}
const state = globalThis as typeof globalThis & { blogWriteQueue?: Promise<unknown> };
export async function saveLocalBlog(input: unknown) {
  const operation = (state.blogWriteQueue ?? Promise.resolve()).catch(() => {}).then(async () => {
    if (!input || typeof input !== 'object') throw new BlogError('Invalid post.');
    const data = input as Record<string, unknown>;
    const current = await readLocalBlogs();
    if (data.revision !== current.revision) throw new BlogError('The blog file changed. Copy your edits, reload the editor, and try again.', 409);
    if (!data.post || typeof data.post !== 'object') throw new BlogError('Invalid post.');
    const raw = data.post as Record<string, unknown>;
    const title = typeof raw.title === 'string' ? raw.title.trim() : '';
    const slug = typeof raw.slug === 'string' ? raw.slug : '';
    if (!title || title.length > 160) throw new BlogError('Add a title of 1 to 160 characters.');
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 100) throw new BlogError('Use a short URL with lowercase letters, numbers, and hyphens.');
    if (raw.status !== 'draft' && raw.status !== 'published') throw new BlogError('Invalid post status.');
    if (typeof raw.excerpt !== 'string' || raw.excerpt.length > 400) throw new BlogError('Keep the excerpt under 400 characters.');
    const existing = current.posts.find(post => post.id === raw.id);
    if (raw.id && !existing) throw new BlogError('Post no longer exists. Reload first.', 409);
    if (current.posts.some(post => post.slug === slug && post.id !== existing?.id)) throw new BlogError('That URL is already used by another post.', 409);
    const content = validateContent(raw.content);
    if (raw.status === 'published' && !blogText(content).trim()) throw new BlogError('Write something before publishing.');
    if (raw.cover && !safeBlogUrl(raw.cover, true)) throw new BlogError('Invalid cover image URL.');
    const now = new Date().toISOString();
    const post: BlogPost = {
      id: existing?.id ?? randomUUID(), slug, title, excerpt: raw.excerpt.trim(),
      tags: Array.isArray(raw.tags) ? raw.tags.filter((tag): tag is string => typeof tag === 'string').slice(0, 8).map(tag => tag.trim().slice(0, 30)).filter(Boolean) : [],
      cover: typeof raw.cover === 'string' ? raw.cover : '', coverAlt: String(raw.coverAlt ?? '').slice(0, 500),
      status: raw.status, createdAt: existing?.createdAt ?? now, updatedAt: now,
      ...(raw.status === 'published' ? { publishedAt: existing?.publishedAt ?? now } : existing?.publishedAt ? { publishedAt: existing.publishedAt } : {}), content,
    };
    const posts = existing ? current.posts.map(item => item.id === existing.id ? post : item) : [post, ...current.posts];
    const source = `import type { BlogPost } from '@/types/blog';\n\n// Posts are stored as JSON-compatible values so the local editor can update this file.\n// Add posts here by hand or use the local editor at /blog during npm run portfolio.\nexport const blogs: BlogPost[] = ${JSON.stringify(posts, null, 2)};\n`;
    const temporary = `${file()}.${randomUUID()}.tmp`;
    await writeFile(temporary, source, 'utf8');
    await rename(temporary, file());
    return { post, posts, revision: revisionOf(source) };
  });
  state.blogWriteQueue = operation;
  return operation;
}

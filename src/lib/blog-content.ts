import type { BlogNode, BlogPost } from '@/types/blog';

export function blogText(node: BlogNode): string {
  if (node.type === 'text') return node.text ?? '';
  return (node.content ?? []).map(blogText).join(node.type === 'paragraph' ? '' : ' ');
}
export function readingMinutes(post: BlogPost) {
  return Math.max(1, Math.ceil(blogText(post.content).split(/\s+/).filter(Boolean).length / 220));
}
export function safeBlogUrl(value: unknown, image = false): string | undefined {
  if (typeof value !== 'string' || value.length > 2048) return;
  if (/^\/(?!\/)/.test(value) && !/[\\\x00-\x20]/.test(value)) return value;
  try {
    const url = new URL(value);
    if (url.protocol === 'https:' || (!image && url.protocol === 'http:')) return url.href;
  } catch { /* Invalid URLs are omitted. */ }
}
export function blogDate(value: string) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(value));
}

export function blogFontSize(value: unknown): number | undefined {
  const size = typeof value === 'number' ? value : typeof value === 'string' && /^\d+(?:px)?$/.test(value) ? Number(value.replace('px', '')) : NaN;
  return Number.isInteger(size) && size >= 12 && size <= 64 ? size : undefined;
}

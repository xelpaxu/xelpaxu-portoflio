'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

export default function LikeButton({ projectId, title }: { projectId?: string; title?: string }) {
  const endpoint = projectId ? `/api/likes?project=${encodeURIComponent(projectId)}` : '/api/likes';
  const [count, setCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    fetch(endpoint, { cache: 'no-store', signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error('Likes unavailable');
        return response.json();
      })
      .then(data => { setCount(data.count); setLiked(data.liked); })
      .catch(() => { if (!controller.signal.aborted) setError('Likes are unavailable right now.'); })
      .finally(() => { if (!controller.signal.aborted) setBusy(false); });
    return () => controller.abort();
  }, [endpoint]);

  async function like() {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const response = await fetch(endpoint, { method: liked ? 'DELETE' : 'POST' });
      if (!response.ok) throw new Error('Could not update your reaction. Try again.');
      const data = await response.json();
      setCount(data.count);
      setLiked(data.liked);
    } catch {
      setError('Could not update your reaction. Try again.');
    } finally { setBusy(false); }
  }

  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-3 border-t border-line pt-3">
      <button type="button" onClick={like} disabled={busy} aria-pressed={liked} aria-label={liked ? `Unlike ${title ?? 'this section'}` : `Like ${title ?? 'this section'}`} aria-busy={busy} title={liked ? 'Click to unlike' : 'Like this'} className={`inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-default ${liked ? 'text-accent' : 'text-strong hover:bg-surface-raised hover:text-accent'}`}>
        <Heart className="size-3.5" fill={liked ? 'currentColor' : 'none'} aria-hidden="true" />
        <span>{busy ? count === null ? 'Loading...' : 'Saving...' : liked ? 'Liked' : 'Like'}</span>
      </button>
      <span aria-live="polite" aria-atomic="true" className="text-xs tabular-nums text-muted">{count === null ? '-' : `${count.toLocaleString()} ${count === 1 ? 'like' : 'likes'}`}</span>
      <span role="status" className="text-xs text-muted">{error}</span>
    </div>
  );
}

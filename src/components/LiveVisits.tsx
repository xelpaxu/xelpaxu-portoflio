'use client';

import { useEffect, useRef, useState } from 'react';
import { Radio } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

interface Counts { total: number; online: number; githubViews: number }

export default function LiveVisits() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const reducedMotion = useReducedMotion();
  const sessionRef = useRef<string | null>(null);
  useEffect(() => {
    if (!sessionRef.current) {
      try {
        sessionRef.current = sessionStorage.getItem('portfolio-visit') || crypto.randomUUID();
        sessionStorage.setItem('portfolio-visit', sessionRef.current);
      } catch { sessionRef.current = crypto.randomUUID(); }
    }
    const controller = new AbortController();
    let pending = false;
    async function heartbeat() {
      if (document.hidden || pending) return;
      pending = true;
      try {
        const response = await fetch('/api/visits', {
          method: 'POST', signal: controller.signal, cache: 'no-store',
          headers: { 'X-Portfolio-Visit': sessionRef.current! },
        });
        if (!response.ok) throw new Error('Unavailable');
        const data = await response.json();
        if (!Number.isFinite(data.total) || !Number.isFinite(data.online)) throw new Error('Invalid count');
        setCounts(data);
        setUnavailable(false);
      } catch (error) { if ((error as Error).name !== 'AbortError') setUnavailable(true); }
      finally { pending = false; }
    }
    void heartbeat();
    const interval = setInterval(heartbeat, 20000);
    document.addEventListener('visibilitychange', heartbeat);
    return () => { controller.abort(); clearInterval(interval); document.removeEventListener('visibilitychange', heartbeat); };
  }, []);
  return (
    <div className="ml-auto flex flex-1 flex-wrap items-center justify-end gap-x-5 gap-y-3">
      <dl className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <div>
          <dt className="text-[11px] leading-5 text-subtle">Portfolio visits</dt>
          <motion.dd key={counts?.total ?? 'loading'} initial={reducedMotion ? false : { opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="text-sm font-semibold tabular-nums">{unavailable ? 'Unavailable' : counts ? counts.total.toLocaleString() : '\u2014'}</motion.dd>
        </div>
        <div title="Tracking-badge requests from your GitHub profile README. GitHub image caching can delay updates.">
          <dt className="text-[11px] leading-5 text-subtle">Profile badge views</dt>
          <dd className="text-sm font-semibold tabular-nums">{unavailable ? 'Unavailable' : counts?.githubViews ? counts.githubViews.toLocaleString() : '\u2014'}</dd>
        </div>
      </dl>
      <p className="flex items-center gap-1.5 text-[11px] text-muted" title="Visitors active within the last minute. Updates every 20 seconds.">
        <Radio aria-hidden="true" className={`size-3 ${counts && !unavailable ? 'text-success' : 'text-subtle'}`} />
        {unavailable ? 'Offline' : counts ? `${counts.online} online` : 'Connecting'}
      </p>
    </div>
  );
}

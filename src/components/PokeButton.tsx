'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Pointer, Heart, Sparkles, Star, Zap } from 'lucide-react';
import { subscribeNekoSteps, type NekoStep } from '@/lib/neko-events';

export default function PokeButton({ children }: { children: ReactNode }) {
  const [count, setCount] = useState<number | null>(null);
  const [error, setError] = useState(false);
  const pending = useRef(0);
  const hasPoked = useRef(false);
  const queue = useRef(Promise.resolve());
  const alive = useRef(true);
  const button = useRef<HTMLButtonElement>(null);
  const iconTemplates = useRef<HTMLDivElement>(null);
  const effects = useRef(new Set<HTMLElement>());

  useEffect(() => {
    alive.current = true;
    const controller = new AbortController();
    fetch('/api/pokes', { signal: controller.signal, cache: 'no-store' })
      .then(response => { if (!response.ok) throw new Error(); return response.json(); })
      .then(data => { if (alive.current && !hasPoked.current) setCount(data.count); })
      .catch(() => { if (!controller.signal.aborted && alive.current) setError(true); });
    const nodes = effects.current;
    return () => { alive.current = false; controller.abort(); nodes.forEach(node => node.remove()); nodes.clear(); };
  }, []);

  useEffect(() => {
    let previous: NekoStep | undefined;
    let touching = false;
    let lastPoke = -Infinity;
    return subscribeNekoSteps(step => {
      const target = button.current;
      const icon = target?.firstElementChild;
      if (!target || !icon || document.hidden || !Number.isFinite(step.clientX) || !Number.isFinite(step.clientY)) return;
      const rect = icon.getBoundingClientRect();
      const radius = rect.width / 2 + Math.min(step.radius, 6);
      const distance = Math.hypot(step.clientX - rect.left - rect.width / 2, step.clientY - rect.top - rect.height / 2);
      const moving = previous !== undefined && Math.hypot(step.clientX - previous.clientX, step.clientY - previous.clientY) > 0.5;
      previous = step;
      if (document.querySelector('.startup-stage') || rect.bottom <= 0 || rect.top >= window.innerHeight || !rect.width) {
        touching = distance <= radius;
        return;
      }
      // Rearm only after she leaves the icon, allowing a little edge tolerance.
      if (distance > radius + 8) touching = false;
      if (distance > radius || touching) return;
      touching = true;
      const now = performance.now();
      if (!moving || now - lastPoke < 1500) return;
      lastPoke = now;
      target.click();
    });
  }, []);

  function burst() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!button.current) return;
    const rect = button.current.getBoundingClientRect();
    {
      // Keep rapid clicking bounded, even before earlier particles finish.
      if (effects.current.size >= 16) { const oldest = effects.current.values().next().value; oldest?.remove(); if (oldest) effects.current.delete(oldest); }
      const node = document.createElement('span');
      node.className = 'poke-particle';
      node.setAttribute('aria-hidden', 'true');
      const icons = iconTemplates.current?.querySelectorAll('svg');
      if (!icons?.length) return;
      node.appendChild(icons[Math.floor(Math.random() * icons.length)].cloneNode(true));
      node.style.left = `${rect.left + rect.width / 2}px`;
      node.style.top = `${rect.top + 4}px`;
      document.body.appendChild(node);
      effects.current.add(node);
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.5;
      const x = Math.cos(angle) * (65 + Math.random() * 25);
      const y = Math.sin(angle) * (70 + Math.random() * 25);
      const animation = node.animate([
        { opacity: 0, transform: 'translate(-50%, -50%) scale(.4)' },
        { opacity: 1, offset: 0.2, transform: `translate(calc(-50% + ${x * .4}px), calc(-50% + ${y * .4}px)) scale(1.1)` },
        { opacity: 0, transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(.7) rotate(${x / 2}deg)` },
      ], { duration: 850, easing: 'cubic-bezier(.2,.7,.3,1)' });
      animation.onfinish = () => { node.remove(); effects.current.delete(node); };
    }
  }

  function poke() {
    burst();
    hasPoked.current = true;
    pending.current++;
    setCount(value => (value ?? 0) + 1);
    setError(false);
    queue.current = queue.current.then(async () => {
      try {
        const response = await fetch('/api/pokes', { method: 'POST' });
        if (!response.ok) throw new Error();
        const data = await response.json();
        pending.current--;
        if (alive.current) { setCount(data.count + pending.current); setError(false); }
      } catch {
        pending.current--;
        if (alive.current) { setCount(value => Math.max(0, (value ?? 1) - 1)); setError(true); }
      }
    });
  }

  return <div className="flex min-w-0 items-center gap-5">
    <div className="relative size-24 shrink-0">
      {children}
      <button ref={button} data-neko-home type="button" onClick={poke} title="Poke Axel" className="group absolute -bottom-3 -right-3 flex size-11 items-center justify-center rounded-full text-muted transition-colors hover:text-accent active:scale-95" aria-label="Poke Axel">
        <span className="flex size-7 items-center justify-center rounded-full border border-line bg-page transition-colors group-hover:border-accent/50"><Pointer className="size-3.5" aria-hidden="true" /></span>
      </button>
    </div>
    <div className="min-w-0">
      <p className="text-lg font-medium tabular-nums leading-6 text-strong">{count === null ? '\u2014' : count.toLocaleString()}</p>
      <p className="mt-0.5 text-[10px] leading-4 text-muted">pokes this month</p>
    </div>
    <div ref={iconTemplates} hidden aria-hidden="true"><Heart /><Sparkles /><Star /><Zap /><Pointer /></div>
    <span className="sr-only" role="status">{count !== null ? `${count} pokes this month` : 'Loading pokes'}</span>
    {error && <p role="status" className="max-w-28 text-[10px] text-muted">Couldn&apos;t save that poke. Try again?</p>}
  </div>;
}

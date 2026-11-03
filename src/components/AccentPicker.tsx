'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Cat, Check, Palette } from 'lucide-react';

const accents = [
  { id: 'default', name: 'Default', color: '#e4e4e7' },
  { id: 'violet', name: 'Light red', color: '#fca5a5' },
  { id: 'blue', name: 'Ocean', color: '#7dd3fc' },
  { id: 'mint', name: 'Mint', color: '#6ee7b7' },
  { id: 'rose', name: 'Rose', color: '#fda4af' },
  { id: 'amber', name: 'Amber', color: '#fcd34d' },
];

function subscribeNeko(onChange: () => void) {
  window.addEventListener('storage', onChange);
  window.addEventListener('portfolio-neko-change', onChange);
  return () => { window.removeEventListener('storage', onChange); window.removeEventListener('portfolio-neko-change', onChange); };
}
function getNekoEnabled() {
  try { return localStorage.getItem('portfolio-neko') !== 'off'; }
  catch { return document.documentElement.dataset.neko !== 'off'; }
}

export default function AccentPicker() {
  const [selected, setSelected] = useState('default');
  const [open, setOpen] = useState(false);
  const nekoEnabled = useSyncExternalStore(subscribeNeko, getNekoEnabled, () => true);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const sync = () => setSelected(document.documentElement.dataset.accent || 'default');
    sync();
    const onStorage = (event: StorageEvent) => {
      if (event.key !== 'portfolio-accent') return;
      document.documentElement.dataset.accent = accents.some(accent => accent.id === event.newValue) ? event.newValue! : 'default';
      sync();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); trigger.current?.focus(); }
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, [open]);

  return (
    <div ref={root} className="sm:relative" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false); }}>
      <button ref={trigger} type="button" aria-label="Choose accent color" title="Choose accent color" aria-expanded={open} aria-controls="accent-picker" onClick={() => setOpen(!open)} className="flex size-11 items-center justify-center rounded-full text-accent transition-colors hover:bg-accent/10"><Palette className="size-5" aria-hidden="true" /></button>
      {open && <div id="accent-picker" className="absolute right-2 top-full mt-3 w-80 rounded-2xl border border-line bg-surface p-4 shadow-dialog sm:right-0">
        <p className="text-sm font-medium">Make it your color</p>
        <p className="mt-1 text-xs text-muted">Across the whole portfolio.</p>
        <div role="group" aria-label="Accent color" className="mt-3 flex flex-wrap gap-1">
          {accents.map(accent => <button key={accent.id} type="button" aria-label={accent.name} aria-pressed={selected === accent.id} title={accent.name} onClick={() => {
            document.documentElement.dataset.accent = accent.id;
            setSelected(accent.id);
            try { localStorage.setItem('portfolio-accent', accent.id); } catch { /* Color still works without storage. */ }
          }} className="flex size-11 items-center justify-center rounded-full"><span className="flex size-8 items-center justify-center rounded-full" style={{ background: accent.color }}>{selected === accent.id && <Check className="size-4 text-[#151520]" aria-hidden="true" />}</span></button>)}
        </div>
        <p role="status" className="mt-2 text-xs text-subtle">{accents.find(accent => accent.id === selected)?.name} selected</p>
        <div className="mt-4 border-t border-line pt-3">
          <button type="button" role="switch" aria-checked={nekoEnabled} onClick={() => {
            const enabled = !nekoEnabled;
            document.documentElement.dataset.neko = enabled ? 'on' : 'off';
            try { localStorage.setItem('portfolio-neko', enabled ? 'on' : 'off'); } catch { /* Still works in this tab. */ }
            window.dispatchEvent(new CustomEvent('portfolio-neko-change', { detail: enabled }));
          }} className="flex min-h-11 w-full items-center justify-between gap-3 text-sm text-strong"><span className="flex items-center gap-2"><Cat className="size-4 text-accent" aria-hidden="true" />Mingkay (cat)</span><span aria-hidden="true" className={`flex h-5 w-9 items-center rounded-full border p-0.5 transition-colors ${nekoEnabled ? 'border-accent bg-accent' : 'border-line bg-transparent'}`}><span className={`size-3.5 rounded-full transition-transform motion-reduce:transition-none ${nekoEnabled ? 'translate-x-4 bg-accent-ink' : 'translate-x-0 bg-muted'}`} /></span></button>
          <p className="mt-1 text-xs leading-5 text-subtle">Chases your mouse, then curls up to sleep. Respects reduced motion.</p>
          <a href="https://github.com/crgimenes/neko" target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-11 items-center text-xs text-muted underline underline-offset-4">Neko by crgimenes<span className="sr-only"> (opens in a new tab)</span></a>
        </div>
      </div>}
    </div>
  );
}

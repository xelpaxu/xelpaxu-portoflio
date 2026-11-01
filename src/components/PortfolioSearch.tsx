'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, BriefcaseBusiness, CornerDownLeft, FileText, Folder, Search, X } from 'lucide-react';
import { searchPortfolio } from '@/lib/portfolio-search';

const icons = { Page: FileText, Project: Folder, Experience: BriefcaseBusiness, PDF: FileText };

export default function PortfolioSearch({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const resultLinks = useRef<(HTMLAnchorElement | null)[]>([]);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const id = useId();
  const results = searchPortfolio(query);
  const activeIndex = Math.min(active, Math.max(0, results.length - 1));

  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = 'hidden';
    input.current?.focus();
    return () => { element?.close(); document.body.style.overflow = previousOverflow; if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true }); };
  }, []);
  useEffect(() => { resultLinks.current[activeIndex]?.scrollIntoView({ block: 'nearest' }); }, [activeIndex, query]);

  return <dialog data-lenis-prevent ref={dialog} aria-labelledby={`${id}-title`} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.currentTarget === event.target) onClose(); }} className="fixed inset-x-0 top-[12dvh] m-0 mx-auto max-h-[76dvh] w-[calc(100%_-_2rem)] max-w-xl overflow-hidden rounded-2xl border border-line bg-surface p-0 text-foreground shadow-dialog backdrop:bg-scrim backdrop:backdrop-blur-sm">
    <div>
      <h2 id={`${id}-title`} className="sr-only">Search the portfolio</h2>
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <Search className="size-5 shrink-0 text-accent" aria-hidden="true" />
        <input ref={input} value={query} onChange={event => { setQuery(event.target.value); setActive(0); }} onKeyDown={event => {
          if (event.nativeEvent.isComposing) return;
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            if (results.length) setActive((activeIndex + (event.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length);
          } else if (event.key === 'Enter') { event.preventDefault(); resultLinks.current[activeIndex]?.click(); }
        }} role="combobox" aria-label="Search pages, projects, technologies, and experience" aria-autocomplete="list" aria-expanded="true" aria-controls={`${id}-results`} aria-activedescendant={results.length ? `${id}-result-${activeIndex}` : undefined} autoComplete="off" spellCheck={false} placeholder="Search projects, skills, experience…" className="min-h-11 min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-subtle" />
        <button type="button" onClick={onClose} aria-label="Close search" className="flex size-11 shrink-0 items-center justify-center rounded-lg text-subtle hover:text-accent"><X className="size-4" aria-hidden="true" /></button>
      </div>
      <div className="px-4 pb-1 pt-3 text-xs text-subtle" role="status">{query.trim() ? `${results.length} ${results.length === 1 ? 'result' : 'results'}` : 'Jump to'}</div>
      <ul id={`${id}-results`} role="listbox" aria-label="Search results" className="max-h-[min(48dvh,380px)] overflow-y-auto overscroll-contain p-2">
        {results.map((entry, index) => { const Icon = icons[entry.kind]; return <li key={entry.id} role="presentation"><Link ref={element => { resultLinks.current[index] = element; }} id={`${id}-result-${index}`} href={entry.href} target={entry.external ? '_blank' : undefined} rel={entry.external ? 'noopener noreferrer' : undefined} role="option" aria-selected={activeIndex === index} tabIndex={-1} onPointerMove={() => setActive(index)} onClick={onClose} className={`flex min-h-16 items-center gap-3 rounded-xl px-3 py-3 transition-colors ${activeIndex === index ? 'bg-accent/10 text-accent' : 'text-strong hover:bg-accent/5'}`}>
          <Icon className="size-4 shrink-0 text-accent" aria-hidden="true" /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-baseline gap-x-3 gap-y-1"><span className="text-sm font-medium">{entry.title}</span><span className="text-[10px] text-subtle">{entry.kind}</span></div><p className="mt-1 line-clamp-1 text-xs leading-5 text-muted">{entry.detail}</p></div>{entry.external ? <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" /> : activeIndex === index && <CornerDownLeft className="size-4 shrink-0" aria-hidden="true" />}
        </Link></li>; })}
      </ul>
      {!results.length && <div className="px-6 py-8 text-center"><p className="text-sm text-strong">No matches for “{query.trim()}”</p><p className="mt-2 text-xs text-muted">Try a project name, React, Python, or resume.</p><button type="button" onClick={() => { setQuery(''); setActive(0); input.current?.focus(); }} className="mt-3 min-h-11 text-xs text-accent">Clear search</button></div>}
      <div className="flex flex-wrap justify-between gap-2 border-t border-line px-4 py-3 text-[11px] text-subtle"><span>↑ ↓ to choose · Enter to open</span><span>Esc to close</span></div>
    </div>
  </dialog>;
}

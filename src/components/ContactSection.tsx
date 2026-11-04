'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy, Send } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { profile } from '@/data/profile';
import { useContact } from './ContactProvider';

export default function ContactSection() {
  const { openContact } = useContact();
  const [status, setStatus] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  async function copyEmail() {
    try { await navigator.clipboard.writeText(profile.email); setStatus('Email copied'); }
    catch { setStatus('Could not copy. Please select the email address.'); }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus(''), 3000);
  }
  return (
    <div className="border-t border-line bg-transparent pt-7 sm:pt-8">
      <h3 className="max-w-md text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">Have something in mind?<br /><span className="text-muted">Let’s build it together.</span></h3>
      <p className="mt-4 max-w-md text-sm leading-7 text-muted">A project idea, an opportunity, or a conversation about something you’re building. My inbox is open.</p>
      <div className="mt-7 flex flex-wrap gap-3">
        <button type="button" onClick={() => openContact()} className="inline-flex min-h-11 items-center gap-3 rounded-full border border-accent bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink transition-colors hover:bg-accent/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">Say hello<Send className="size-5" aria-hidden="true" /></button>
        <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-medium transition-colors hover:bg-surface-raised"><FaGithub className="size-4" aria-hidden="true" />Find me on GitHub</a>
      </div>
      <div className="mt-7 flex items-center gap-2 border-t border-line pt-5">
        <a href={`mailto:${profile.email}`} className="min-w-0 break-all text-sm text-muted hover:text-foreground">{profile.email}</a>
        <button onClick={copyEmail} type="button" aria-label="Copy email address" className="flex size-11 shrink-0 items-center justify-center rounded-lg text-subtle hover:bg-surface-raised hover:text-foreground">{status === 'Email copied' ? <Check className="size-4" /> : <Copy className="size-4" />}</button>
      </div>
      <p role="status" className="min-h-5 text-xs text-subtle">{status}</p>
    </div>
  );
}

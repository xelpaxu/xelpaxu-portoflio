'use client';

import { ArrowUp, Download, Send } from 'lucide-react';
import { useContact } from './ContactProvider';

export default function SiteFooter() {
  const { openContact } = useContact();
  return <footer className="site-footer"><div className="site-footer-identity"><span>Axel John Nuqui</span><span>Iloilo City, Philippines</span></div><nav aria-label="Footer links"><a href="/NUQUI_CV.pdf" target="_blank" rel="noopener noreferrer">Résumé<Download size={13} aria-hidden="true" /><span className="sr-only"> (PDF, opens in a new tab)</span></a><button type="button" onClick={() => openContact()}>Say hello<Send size={13} aria-hidden="true" /></button><button type="button" onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>Back to top<ArrowUp size={14} aria-hidden="true" /></button></nav></footer>;
}

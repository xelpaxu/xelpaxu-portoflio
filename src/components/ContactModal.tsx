'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { Send, X } from 'lucide-react';
import { profile } from '@/data/profile';
import type { ContactTopic } from './ContactProvider';

const topics: { id: ContactTopic; label: string; placeholder: string }[] = [
  { id: 'project', label: 'A project', placeholder: 'What are you hoping to build?' },
  { id: 'opportunity', label: 'An opportunity', placeholder: 'Tell me about the role or opportunity.' },
  { id: 'hello', label: 'Just saying hello', placeholder: 'What is on your mind?' },
];

export default function ContactModal({ initialTopic, onClose }: { initialTopic: ContactTopic; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const name = useRef<HTMLInputElement>(null);
  const id = useId();
  const [topic, setTopic] = useState(initialTopic);
  const [previewed, setPreviewed] = useState(false);

  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    element?.showModal();
    name.current?.focus();
    return () => { element?.close(); document.body.style.overflow = overflow; previous?.focus({ preventScroll: true }); };
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (event.currentTarget.reportValidity()) setPreviewed(true);
  }

  return <dialog ref={dialog} className="contact-dialog" data-lenis-prevent aria-labelledby={`${id}-title`} aria-describedby={`${id}-preview`} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="contact-dialog-inner">
      <div className="contact-dialog-heading"><span className="contact-dialog-symbol"><Send size={18} aria-hidden="true" /></span><button type="button" onClick={onClose} aria-label="Close contact form"><X size={20} /></button></div>
      <h2 id={`${id}-title`}>Let&apos;s start a conversation.</h2>
      <p className="contact-dialog-intro">An idea, an opportunity, or a simple hello.</p>
      <form onSubmit={submit} onChange={() => setPreviewed(false)}>
        <fieldset className="contact-topics"><legend className="sr-only">What would you like to talk about?</legend>{topics.map(item => <button key={item.id} type="button" aria-pressed={topic === item.id} onClick={() => { setTopic(item.id); setPreviewed(false); }}>{item.label}</button>)}</fieldset>
        <div className="contact-field-row">
          <div className="contact-field"><label htmlFor={`${id}-name`}>Preferred name</label><input ref={name} id={`${id}-name`} name="name" autoComplete="given-name" placeholder="What should I call you?" required minLength={2} maxLength={80} /></div>
          <div className="contact-field"><label htmlFor={`${id}-email`}>Email address</label><input id={`${id}-email`} name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} /></div>
        </div>
        <div className="contact-field"><label htmlFor={`${id}-message`}>Your message</label><textarea id={`${id}-message`} name="message" rows={5} required minLength={20} maxLength={5000} placeholder={topics.find(item => item.id === topic)?.placeholder} /></div>
        {previewed && <p className="contact-preview-notice" role="status">Preview only. Your message has not been sent. <a href={`mailto:${profile.email}`}>Email Axel directly</a></p>}
        <div className="contact-dialog-bottom"><p id={`${id}-preview`}>Form preview.<br />Sending isn&apos;t connected yet.</p><button type="submit" className="contact-submit">Send message<Send size={16} aria-hidden="true" /></button></div>
      </form>
    </div>
  </dialog>;
}

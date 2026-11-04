'use client';

import { Send } from 'lucide-react';
import { useContact, type ContactTopic } from './ContactProvider';

export default function ContactButton({ label = 'Get in touch', topic = 'hello', className = '' }: { label?: string; topic?: ContactTopic; className?: string }) {
  const { openContact } = useContact();
  return <button type="button" onClick={() => openContact(topic)} className={`inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${className}`}>{label}<Send size={15} aria-hidden="true" /></button>;
}

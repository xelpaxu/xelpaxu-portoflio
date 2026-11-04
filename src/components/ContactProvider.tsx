'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';

export type ContactTopic = 'project' | 'opportunity' | 'hello';
const ContactModal = dynamic(() => import('./ContactModal'), { ssr: false });
const Context = createContext<{ openContact: (topic?: ContactTopic) => void } | null>(null);

export function ContactProvider({ children }: { children: ReactNode }) {
  const [topic, setTopic] = useState<ContactTopic | null>(null);
  const openContact = useCallback((intent: ContactTopic = 'hello') => setTopic(intent), []);
  return <Context.Provider value={{ openContact }}>{children}{topic && <ContactModal initialTopic={topic} onClose={() => setTopic(null)} />}</Context.Provider>;
}

export function useContact() {
  const context = useContext(Context);
  if (!context) throw new Error('ContactProvider is missing');
  return context;
}

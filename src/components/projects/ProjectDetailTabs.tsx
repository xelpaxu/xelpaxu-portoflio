'use client';

import { useId, useRef, useState, type ReactNode, type KeyboardEvent } from 'react';
import { FileText, Grid2X2, Route, Code2, MessageSquare } from 'lucide-react';
const icons = { overview: FileText, features: Grid2X2, workflow: Route, build: Code2, feedback: MessageSquare };

export interface ProjectDetailTab { id: string; label: string; content: ReactNode }

export default function ProjectDetailTabs({ tabs }: { tabs: ProjectDetailTab[] }) {
  const id = useId();
  const [selected, setSelected] = useState(tabs[0]?.id);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const strip = useRef<HTMLDivElement>(null);

  function select(index: number, focus = false) {
    setSelected(tabs[index].id);
    const button = buttons.current[index];
    if (focus) button?.focus({ preventScroll: true });
    if (button && strip.current) strip.current.scrollLeft = button.offsetLeft - (strip.current.clientWidth - button.clientWidth) / 2;
  }
  function keyboard(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    select(next, true);
  }

  if (!tabs.length) return null;
  return <section className="project-details" aria-label="Project details">
    <div ref={strip} className="project-detail-tabs" role="tablist" aria-label="Project details">
      {tabs.map((tab, index) => {
        const Icon = icons[tab.id as keyof typeof icons] ?? FileText;
        return <button key={tab.id} ref={element => { buttons.current[index] = element; }} type="button" role="tab" id={`${id}-tab-${tab.id}`} aria-controls={`${id}-panel-${tab.id}`} aria-selected={selected === tab.id} tabIndex={selected === tab.id ? 0 : -1} onClick={() => select(index)} onKeyDown={event => keyboard(event, index)}><Icon size={15} aria-hidden="true" /><span>{tab.label}</span></button>;
      })}
    </div>
    {tabs.map(tab => <div key={tab.id} role="tabpanel" id={`${id}-panel-${tab.id}`} aria-labelledby={`${id}-tab-${tab.id}`} hidden={selected !== tab.id} tabIndex={0} className="project-detail-panel">{tab.content}</div>)}
  </section>;
}

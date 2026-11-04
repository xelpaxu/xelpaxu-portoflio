'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowLeft, ArrowRight, ChevronRight, UserRound, CircleCheck } from 'lucide-react';
import type { ProjectJourney } from '@/types/project';

export default function ProjectWorkflow({ journeys }: { journeys: ProjectJourney[] }) {
  const [path, setPath] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  useEffect(() => {
    const item = buttons.current[stepIndex]?.parentElement;
    const list = item?.parentElement;
    if (item && list && getComputedStyle(list).display === 'flex') list.scrollLeft = item.offsetLeft - (list.clientWidth - item.clientWidth) / 2;
  }, [path, stepIndex]);
  const journey = journeys[path];
  const step = journey?.steps[stepIndex];
  if (!journey || !step) return null;

  function selectStep(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = Math.min(index + 1, journey.steps.length - 1);
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = Math.max(index - 1, 0);
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = journey.steps.length - 1;
    else return;
    event.preventDefault();
    setStepIndex(next);
    buttons.current[next]?.focus({ preventScroll: true });
  }

  return <div className="project-workflow-explorer">
    <div className="project-content-heading"><div><h2>Follow the user journey</h2><p>See who acts, what happens, and what each step produces.</p></div></div>
    {journeys.length > 1 && <div className="project-journey-selector" role="group" aria-label="Choose a user journey">{journeys.map((item, index) => <button type="button" key={item.id} aria-pressed={path === index} onClick={() => { setPath(index); setStepIndex(0); }}>{item.title}</button>)}</div>}
    <p className="project-journey-summary">{journey.summary}</p>
    <div className="project-workflow-layout">
      <nav aria-label={`${journey.title} steps`}><ol className="project-workflow-steps">{journey.steps.map((item, index) => <li key={item.title}><button ref={element => { buttons.current[index] = element; }} type="button" aria-current={index === stepIndex ? 'step' : undefined} aria-controls={`${id}-detail`} onClick={() => setStepIndex(index)} onKeyDown={event => selectStep(event, index)}><span className="project-workflow-number">{index + 1}</span><span className="project-workflow-step-label"><strong>{item.title}</strong><small>{item.actor}</small></span><ChevronRight size={15} aria-hidden="true" /></button></li>)}</ol></nav>
      <div className="project-workflow-inspector">
        <section id={`${id}-detail`} aria-label="Selected workflow step" aria-live="polite" aria-atomic="true">
          <div key={`${journey.id}-${stepIndex}`} className="project-workflow-detail">
            <span className="project-workflow-position">Step {stepIndex + 1} of {journey.steps.length}</span>
            <h3>{step.title}</h3>
            <div className="project-workflow-actor"><UserRound size={14} aria-hidden="true" /><span>{step.actor}</span></div>
            <dl><div><dt>What happens</dt><dd>{step.description}</dd></div>{step.result && <div className="project-workflow-result"><dt><CircleCheck size={15} aria-hidden="true" />The result</dt><dd>{step.result}</dd></div>}</dl>
          </div>
        </section>
        <div className="project-workflow-navigation"><button type="button" disabled={stepIndex === 0} onClick={() => setStepIndex(index => index - 1)}><ArrowLeft size={15} aria-hidden="true" />Previous step</button><button type="button" disabled={stepIndex === journey.steps.length - 1} onClick={() => setStepIndex(index => index + 1)}>Next step<ArrowRight size={15} aria-hidden="true" /></button></div>
      </div>
    </div>
  </div>;
}

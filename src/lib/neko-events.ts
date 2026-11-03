export const NEKO_STEP_EVENT = 'portfolio-neko-step';

export interface NekoStep {
  clientX: number;
  clientY: number;
  radius: number;
}

export function emitNekoStep(step: NekoStep) {
  window.dispatchEvent(new CustomEvent<NekoStep>(NEKO_STEP_EVENT, { detail: step }));
}

export function subscribeNekoSteps(listener: (step: NekoStep) => void) {
  const onStep = (event: Event) => listener((event as CustomEvent<NekoStep>).detail);
  window.addEventListener(NEKO_STEP_EVENT, onStep);
  return () => window.removeEventListener(NEKO_STEP_EVENT, onStep);
}

export const NEKO_CHASE_EVENT = 'portfolio-neko-chase';
export function emitNekoChase() {
  window.dispatchEvent(new Event(NEKO_CHASE_EVENT));
}

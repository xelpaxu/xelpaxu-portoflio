'use client';

import { useEffect, useId, useRef, useState, type RefObject } from 'react';
import { useReducedMotion } from 'framer-motion';
import { stepRat, ratEscape, type RatBounds } from '@/lib/rat';
import { FEED_DURATION, feedingFrame } from '@/lib/rat-feeding';
import { emitNekoChase, subscribeNekoSteps } from '@/lib/neko-events';
import { Pause, Play, Sparkles } from 'lucide-react';

type Point = { x: number; y: number };
type Phase = 'hunting' | 'feeding' | 'fleeing' | 'hiding' | 'returning';
type Destination = Point & { cell?: SVGRectElement };
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export default function GitHubCrawler({ hostRef, enabled }: { hostRef: RefObject<HTMLDivElement | null>; enabled: boolean }) {
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [phase, setPhase] = useState<Phase>('hunting');
  const [restoredCount, setRestoredCount] = useState(0);
  const [inView, setInView] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const bodyRef = useRef<SVGGElement>(null);
  const recoveryRef = useRef<SVGGElement>(null);
  const spriteRef = useRef<SVGSVGElement>(null);
  const alertRef = useRef<SVGTextElement>(null);
  const feedingRef = useRef<SVGGElement>(null);
  const clipRef = useRef<SVGRectElement>(null);
  const scatterRequested = useRef(false);
  const controls = useRef({ paused: false, inView: false, reducedMotion: false });
  const scatterAction = useRef<() => void>(() => {});
  const gradientId = useId().replace(/:/g, '');

  useEffect(() => {
    controls.current = { paused, inView, reducedMotion: !!reducedMotion };
  }, [paused, inView, reducedMotion]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let intersects = false;
    const update = () => setInView(intersects && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { intersects = entry.isIntersecting; update(); });
    observer.observe(host);
    document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, [hostRef]);

  useEffect(() => {
    const host = hostRef.current;
    const svg = svgRef.current;
    const body = bodyRef.current;
    if (!host || !svg || !body || !enabled) return;
    const morsel = feedingRef.current?.querySelector('rect');
    const crumbs = Array.from(feedingRef.current?.querySelectorAll('circle') ?? []);
    const recoveryNodes = Array.from(recoveryRef.current?.children ?? []);
    const recoveries: { cell: SVGRectElement; started: number; slot: number }[] = [];
    const protectedUntil = new Map<SVGRectElement, number>();
    const cellAnimations = new Set<Animation>();
    let feedbackClock = 0;
    let lastChaseBubble = -10;
    let nextRecovery = 0;
    let restoredTotal = 0;
    const eaten = new Map<SVGRectElement, string>();
    let width = host.clientWidth;
    let height = host.clientHeight;
    let cells: Destination[] = [];
    let surfaces: Destination[] = [];
    let gridTop = 0;
    let gridBottom = 130;
    let position = { x: width * 0.75, y: 70 };
    let goal: Destination = position;
    let visit = 0;
    let rest = 1;
    let feeding: { cell: SVGRectElement; fill: string; opacity: string; started: number; color: string } | undefined;
    const rat = { ...position, vx: 0, vy: 0, facing: 1 as -1 | 1 };
    let ratBounds: RatBounds = { left: 32, right: width - 32, top: 25, bottom: 100 };
    let approach = { ...position };
    let approachFacing: -1 | 1 = 1;
    let lastCat = { x: -500, y: -500 };
    let escape = { ...position };
    let clock = 0;
    let currentPhase: Phase = 'hunting';
    let phaseStarted = 0;
    let frame = 0;
    let previousTime = 0;
    function cancelFeeding() {
      if (feeding) feeding.cell.style.opacity = feeding.opacity;
      feeding = undefined;
      feedingRef.current?.setAttribute('opacity', '0');
    }
    function restoreCells() {
      eaten.forEach((fill, cell) => { cell.style.fill = fill; });
      eaten.clear();
    }

    function measure() {
      const bounds = host!.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      svg!.setAttribute('viewBox', `0 0 ${width} ${height}`);
      const center = (element: Element): Destination => {
        const r = element.getBoundingClientRect();
        return { x: r.left - bounds.left + r.width / 2, y: r.top - bounds.top + r.height / 2 };
      };
      const viewport = host!.querySelector('[role="region"]')?.getBoundingClientRect();
      surfaces = Array.from(host!.querySelectorAll<SVGRectElement>('[data-commit-date]')).filter(cell => {
        const r = cell.getBoundingClientRect();
        return r.width && (!viewport || (r.left >= viewport.left && r.right <= viewport.right));
      }).map(cell => ({ ...center(cell), cell }));
      cells = surfaces.filter(p => p.cell?.dataset.crawlerFood === 'true');
      if (surfaces.length) {
        gridTop = Math.min(...surfaces.map(p => p.y));
        gridBottom = Math.max(...surfaces.map(p => p.y));
      }
      clipRef.current?.setAttribute('x', '0');
      clipRef.current?.setAttribute('y', String(gridTop - 10));
      clipRef.current?.setAttribute('width', String(width));
      clipRef.current?.setAttribute('height', String(gridBottom - gridTop + 20));
      position.x = clamp(position.x, 25, width - 25);
      position.y = clamp(position.y, gridTop, gridBottom);
      ratBounds = { left: 32, right: Math.max(32, width - 32), top: gridTop, bottom: gridBottom };
      rat.x = clamp(rat.x, ratBounds.left, ratBounds.right);
      rat.y = clamp(rat.y, gridTop, gridBottom);
    }

    function chooseGoal() {
      visit += 1;
      const uneaten = cells.filter(p => p.cell && !eaten.has(p.cell));
      if (!uneaten.length && cells.length) restoreCells();
      const food = (uneaten.length ? uneaten : cells).filter(p => !p.cell || (protectedUntil.get(p.cell) ?? 0) <= clock);
      // Squares are food targets only; locomotion is continuous in pixel space.
      const candidates = food.filter(p => distance(p, position) > 55).sort((a, b) => distance(a, position) - distance(b, position));
      const choices = candidates.length ? candidates.slice(0, 4) : food;
      if (choices.length) goal = choices[visit % choices.length];
      else goal = { ...position };
      approachFacing = goal.x < 48 ? -1 : goal.x > width - 48 ? 1 : goal.x >= rat.x ? 1 : -1;
      approach = { x: clamp(goal.x - approachFacing * 12, ratBounds.left, ratBounds.right), y: clamp(goal.y, ratBounds.top, ratBounds.bottom) };
      // Short feeding pauses punctuate runs of quicker, irregular footfalls.
      rest = visit % 5 === 0 ? 0.8 + Math.sin(visit * 1.7) * 0.25 : 0.12 + (Math.sin(visit * 2.3) + 1) * 0.09;
    }

    function changePhase(next: Phase) { currentPhase = next; phaseStarted = clock; setPhase(next); }
    measure();
    position = { x: width * 0.62, y: (gridTop + gridBottom) / 2 };
    rat.x = position.x; rat.y = position.y;
    chooseGoal();
    const resize = new ResizeObserver(measure);
    resize.observe(host);
    const mutation = new MutationObserver(measure);
    mutation.observe(host, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-crawler-food'] });
    host.addEventListener('scroll', measure, true);
    scatterAction.current = () => { if (currentPhase !== 'hiding') scatterRequested.current = true; };

    const unsubscribeCat = subscribeNekoSteps(step => {
      if (!controls.current.inView || !Number.isFinite(step?.clientX) || !Number.isFinite(step?.clientY)) return;
      const before = restoredTotal;
      const bounds = host!.getBoundingClientRect();
      lastCat = { x: step.clientX - bounds.left, y: step.clientY - bounds.top };
      if (distance(lastCat, rat) < 100 && currentPhase !== 'hiding' && clock - lastChaseBubble > 2.5) {
        lastChaseBubble = clock;
        emitNekoChase();
      }
      if (distance(lastCat, rat) < 78 && (currentPhase === 'hunting' || currentPhase === 'feeding' || currentPhase === 'returning')) {
        cancelFeeding(); escape = ratEscape(lastCat, ratBounds); changePhase('fleeing');
      }
      // Use current DOM bounds so scrolling and smooth scrolling cannot leave
      // the collision targets at their old viewport positions.
      eaten.forEach((fill, cell) => {
        const r = cell.getBoundingClientRect();
        const x = clamp(step.clientX, r.left, r.right);
        const y = clamp(step.clientY, r.top, r.bottom);
        if (Math.hypot(step.clientX - x, step.clientY - y) > step.radius) return;
        const region = cell.closest('[role="region"]')?.getBoundingClientRect();
        if (region && (step.clientX < region.left || step.clientX > region.right || step.clientY < region.top || step.clientY > region.bottom)) return;
        cell.style.fill = fill;
        eaten.delete(cell);
        protectedUntil.set(cell, clock + 8);
        const slot = nextRecovery++ % Math.max(1, recoveryNodes.length);
        const existing = recoveries.findIndex(burst => burst.slot === slot);
        if (existing !== -1) recoveries.splice(existing, 1);
        recoveries.push({ cell, started: feedbackClock, slot });
        if (!controls.current.reducedMotion) {
          const animation = cell.animate([{ transform: 'scale(0.65)', opacity: 0.45 }, { transform: 'scale(1.45)', opacity: 1, offset: 0.45 }, { transform: 'scale(1)', opacity: 1 }], { duration: 650, easing: 'cubic-bezier(.2,.8,.2,1)' });
          cellAnimations.add(animation);
          animation.onfinish = () => cellAnimations.delete(animation);
        }
        restoredTotal += 1;
      });
      if (restoredTotal !== before) setRestoredCount(restoredTotal);
    });

    function drawRecoveries() {
      recoveryNodes.forEach(node => node.setAttribute('opacity', '0'));
      for (let i = recoveries.length - 1; i >= 0; i--) {
        const burst = recoveries[i];
        const t = (feedbackClock - burst.started) / 0.95;
        if (t >= 1) { recoveries.splice(i, 1); continue; }
        const node = recoveryNodes[burst.slot];
        if (!node) continue;
        const r = burst.cell.getBoundingClientRect();
        const bounds = host!.getBoundingClientRect();
        node.setAttribute('transform', `translate(${r.left - bounds.left + r.width / 2} ${r.top - bounds.top + r.height / 2})`);
        node.setAttribute('opacity', String(1 - t));
        const ring = node.querySelector('circle');
        ring?.setAttribute('r', String(controls.current.reducedMotion ? 8 : 4 + t * 18));
        const stars = node.querySelectorAll('path');
        stars.forEach((star, j) => {
          const a = j * Math.PI / 2 + Math.PI / 4;
          const spread = controls.current.reducedMotion ? 9 : 5 + t * 21;
          star.setAttribute('transform', `translate(${Math.cos(a) * spread} ${Math.sin(a) * spread}) scale(${1 - t * 0.6})`);
        });
      }
    }

    function draw(time: number) {
      const dt = Math.min((time - (previousTime || time)) / 1000, 0.035);
      previousTime = time;
      const { inView, paused, reducedMotion } = controls.current;
      if (inView) feedbackClock += dt;
      drawRecoveries();
      const active = inView && !paused;
      if (!active) { frame = requestAnimationFrame(draw); return; }
      clock += dt;
      if (scatterRequested.current) {
        scatterRequested.current = false;
        cancelFeeding(); escape = ratEscape(lastCat.x < 0 ? rat : lastCat, ratBounds); changePhase('fleeing');
      }
      if (currentPhase === 'fleeing' && !reducedMotion) {
        if (stepRat(rat, escape, dt, ratBounds, true)) changePhase('hiding');
      } else if (currentPhase === 'fleeing' && reducedMotion) changePhase('hiding');
      if (currentPhase === 'hiding' && clock - phaseStarted > 5) {
        const spawn = ratEscape(lastCat, ratBounds);
        rat.x = spawn.x; rat.y = spawn.y; rat.vx = 0; rat.vy = 0;
        changePhase('returning');
      }
      if (currentPhase === 'returning' && clock - phaseStarted > 0.7) { changePhase('hunting'); chooseGoal(); }
      if (!reducedMotion && currentPhase === 'hunting') {
        rest -= dt;
        const arrived = stepRat(rat, approach, dt, ratBounds);
        if (rest <= 0 && arrived) {
          if (goal.cell && !eaten.has(goal.cell) && (protectedUntil.get(goal.cell) ?? 0) <= clock && distance(lastCat, rat) >= 78) {
            rat.facing = approachFacing;
            feeding = { cell: goal.cell, fill: goal.cell.style.fill, opacity: goal.cell.style.opacity, started: clock, color: goal.cell.getAttribute('fill') ?? 'var(--activity-4)' };
            rat.vx = 0; rat.vy = 0;
            changePhase('feeding');
          } else chooseGoal();
        }
      }
      position = { x: rat.x, y: rat.y };
      if (currentPhase === 'feeding' && feeding) {
        const bite = feedingFrame(clock - feeding.started);
        const r = feeding.cell.getBoundingClientRect();
        const bounds = host!.getBoundingClientRect();
        const start = { x: r.left - bounds.left + r.width / 2, y: r.top - bounds.top + r.height / 2 };
        const mouth = { x: position.x + rat.facing * 14, y: position.y + 1 };
        feeding.cell.style.opacity = bite.progress > 0.16 ? '0.08' : feeding.opacity;
        const x = mix(start.x, mouth.x, bite.pull);
        const y = mix(start.y, mouth.y, bite.pull) - (reducedMotion ? 0 : Math.sin(bite.pull * Math.PI) * 14);
        const size = reducedMotion ? 1 : Math.max(0, 1 - Math.max(0, bite.progress - 0.47) / 0.23);
        feedingRef.current?.setAttribute('opacity', reducedMotion ? '0' : '1');
        morsel?.setAttribute('fill', feeding.color);
        morsel?.setAttribute('width', String(r.width)); morsel?.setAttribute('height', String(r.height));
        morsel?.setAttribute('x', String(-r.width / 2)); morsel?.setAttribute('y', String(-r.height / 2));
        morsel?.setAttribute('transform', `translate(${x} ${y}) rotate(${bite.pull * 110}) scale(${size})`);
        crumbs.forEach((crumb, i) => {
          const spread = Math.max(0, bite.progress - 0.5) * 36;
          crumb.setAttribute('cx', String(mouth.x + Math.cos(i * 2.4) * spread));
          crumb.setAttribute('cy', String(mouth.y + Math.sin(i * 2.4) * spread));
          crumb.setAttribute('opacity', String(bite.progress > 0.5 ? Math.max(0, 1 - (bite.progress - 0.5) * 2) : 0));
        });
        if (bite.done) {
          eaten.set(feeding.cell, feeding.fill);
          feeding.cell.style.fill = 'var(--activity-0)';
          cancelFeeding();
          changePhase('hunting'); chooseGoal();
        }
      }
      const returning = currentPhase === 'returning';
      const scale = currentPhase === 'hiding' ? 0 : returning ? Math.min(1, (clock - phaseStarted) / 0.7) : 1;
      const bob = reducedMotion ? 0 : currentPhase === 'feeding' ? 0 : Math.hypot(rat.vx, rat.vy) > 8 ? Math.sin(clock * 12) * 0.25 : 0;
      body!.setAttribute('transform', `translate(${position.x} ${position.y + bob}) scale(${-rat.facing * scale} ${scale})`);
      body!.style.opacity = String(scale);
      const walking = Math.hypot(rat.vx, rat.vy) > 8 && (currentPhase === 'hunting' || currentPhase === 'fleeing');
      const spriteFrame = reducedMotion ? 0 : currentPhase === 'feeding' ? Math.min(9, Math.floor((clock - phaseStarted) / FEED_DURATION * 10)) : Math.floor(clock * (currentPhase === 'fleeing' ? 16 : 10)) % 10;
      spriteRef.current?.setAttribute('viewBox', `${spriteFrame * 32} ${currentPhase === 'feeding' ? 96 : walking ? 64 : 0} 32 32`);
      alertRef.current?.setAttribute('opacity', currentPhase === 'fleeing' ? '1' : '0');
      frame = requestAnimationFrame(draw);
    }
    frame = requestAnimationFrame(draw);
    return () => { cancelFeeding(); unsubscribeCat(); cellAnimations.forEach(animation => animation.cancel()); cancelAnimationFrame(frame); resize.disconnect(); mutation.disconnect(); host.removeEventListener('scroll', measure, true); restoreCells(); scatterAction.current = () => {}; };
  }, [enabled, hostRef]);

  if (!enabled) return null;
  return <>
    <div className="my-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
      <p role="status" className="text-xs leading-5 text-muted">{phase === 'feeding' ? 'The snake is nibbling a contribution. Bring Mingkay closer!' : phase === 'fleeing' ? 'Caught! The snake is running away.' : phase === 'hiding' ? 'The snake is hiding. Mingkay is on patrol.' : paused || reducedMotion ? 'The snake is resting.' : 'Mingkay can chase the snake away and restore eaten contributions.'}{restoredCount > 0 && <span className="ml-2 text-accent">{restoredCount} restored.</span>}</p>
      <div className="flex items-center gap-1">
        <button type="button" disabled={phase === 'hiding'} onClick={() => { setPaused(false); scatterAction.current(); }} className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-xs text-strong hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-40">Shoo snake</button>
        <button type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)} className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-xs text-muted hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-accent">{paused ? <Play className="size-3.5" aria-hidden="true" /> : <Pause className="size-3.5" aria-hidden="true" />}{paused ? 'Resume' : 'Pause'}</button>
      </div>
    </div>
    <a href="https://opengameart.org/content/animated-snake" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-[11px] text-subtle underline-offset-4 hover:underline">Snake art by Calciumtrice (CC BY 3.0)</a>
    <svg ref={svgRef} className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-hidden" role="group" aria-label="Snake and Mingkay contribution animation">
      <defs><clipPath id={`${gradientId}-bounds`}><rect ref={clipRef} /></clipPath></defs>
      <g clipPath={`url(#${gradientId}-bounds)`}>
      <g ref={bodyRef} role="button" tabIndex={0} aria-label="Shoo the snake away" aria-disabled={phase === 'hiding'} style={{ pointerEvents: phase === 'hiding' ? 'none' : 'auto' }} className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-accent" onClick={() => { setPaused(false); scatterAction.current(); }} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setPaused(false); scatterAction.current(); } }}>
        <rect x={-22} y={-22} width={44} height={44} rx={8} fill="transparent" stroke="transparent" />
        <ellipse cx={-2} cy={12} rx={14} ry={2} fill="var(--page)" opacity={0.5} />
        <svg ref={spriteRef} x={-32} y={-50} width={64} height={64} viewBox="0 0 32 32" style={{ imageRendering: 'pixelated' }} aria-hidden="true"><image href="/assets/snake%20spritesheet%20calciumtrice.png" width={320} height={160} /></svg>
        <text ref={alertRef} x={0} y={-10} textAnchor="middle" fill="var(--warning)" stroke="var(--page)" strokeWidth={0.5} fontSize={17} fontWeight={800} opacity={0} aria-hidden="true">!</text>
      </g>
      <g ref={feedingRef} opacity={0} aria-hidden="true"><rect width={10} height={10} rx={2} stroke="var(--activity-4)" strokeWidth={1} />{Array.from({ length: 9 }, (_, i) => <circle key={i} r={1 + i % 3 * 0.4} fill="var(--activity-4)" opacity={0} />)}</g>
      <g ref={recoveryRef} aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <g key={i} opacity={0}><circle r={4} fill="none" stroke="var(--activity-4)" strokeWidth={1.2} />{Array.from({ length: 4 }, (_, j) => <path key={j} d="M0 -2.5 L0 2.5 M-2.5 0 L2.5 0" fill="none" stroke="var(--activity-4)" strokeWidth={1.3} strokeLinecap="round" />)}</g>)}</g>

      </g>
    </svg>
  </>;
}

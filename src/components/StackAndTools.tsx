'use client';

import { useId, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useIsPresent, useReducedMotion } from 'framer-motion';
import TechStack from '@/components/TechStack';
import { goToTechnologies } from '@/data/stack-preferences';

const groups = [
  {
    name: 'Frontend',
    items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'React Native', 'Flutter', 'Dart', 'TanStack Query', 'Framer Motion', 'GSAP'],
  },
  {
    name: 'Backend',
    items: ['Node.js', 'Express', 'Python', 'Django', 'FastAPI', 'PostgreSQL', 'MySQL'],
  },
  {
    name: 'Tools',
    items: ['Figma', 'Visual Studio Code', 'Antigravity', 'Codex', 'OpenCode', 'OmniRoute', 'Git', 'Docker', 'GitHub Actions'],
  },
  {
    name: 'Platforms',
    items: ['GitHub', 'Vercel', 'Firebase', 'Supabase', 'Convex', 'Clerk', 'Expo', 'Hugging Face'],
  },
];

export default function StackAndTools() {
  const [active, setActive] = useState(0);
  const id = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  return (
    <div className="stack-directory">
      <LayoutGroup id={id}>
      <div role="tablist" aria-label="Technology categories" className="stack-tabs">
        {groups.map((group, index) => <button
          key={group.name}
          ref={element => { tabs.current[index] = element; }}
          type="button"
          role="tab"
          id={`${id}-tab-${index}`}
          aria-controls={`${id}-panel-${index}`}
          aria-selected={active === index}
          tabIndex={active === index ? 0 : -1}
          onClick={() => setActive(index)}
          onKeyDown={event => {
            let next = index;
            if (event.key === 'ArrowRight') next = (index + 1) % groups.length;
            else if (event.key === 'ArrowLeft') next = (index + groups.length - 1) % groups.length;
            else if (event.key === 'Home') next = 0;
            else if (event.key === 'End') next = groups.length - 1;
            else return;
            event.preventDefault();
            setActive(next);
            tabs.current[next]?.focus();
          }}
          className="stack-tab"
        >
          <span>{group.name}</span>
          <span className="stack-tab-count">{group.items.length}</span>
          {active === index && <motion.span aria-hidden="true" layoutId="stack-tab-underline" className="stack-tab-underline"
            transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 32 }} />}
        </button>)}
      </div>
      </LayoutGroup>
      {goToTechnologies.length > 0 && <p className="stack-preference-legend">Circled logos are my go-to picks for new projects</p>}
      <div className="stack-panel-stage">
        <AnimatePresence mode="wait" initial={false}>
          <StackPanel key={active} id={`${id}-panel-${active}`} labelledBy={`${id}-tab-${active}`}
            tags={groups[active].items} reducedMotion={!!reducedMotion} />
        </AnimatePresence>
      </div>
    </div>
  );
}

function StackPanel({ id, labelledBy, tags, reducedMotion }: {
  id: string; labelledBy: string; tags: string[]; reducedMotion: boolean;
}) {
  const present = useIsPresent();
  return <motion.div role="tabpanel" id={id} aria-labelledby={labelledBy}
    aria-hidden={!present || undefined} tabIndex={present ? 0 : -1} className="stack-panel"
    initial={reducedMotion ? false : 'hidden'} animate="visible" exit="exit">
    <TechStack tags={tags} animated={!reducedMotion} interactive goTo={goToTechnologies} />
  </motion.div>;
}

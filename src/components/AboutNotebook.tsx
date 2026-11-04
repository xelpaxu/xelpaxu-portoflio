'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, CornerDownLeft, MessageCircle, RotateCcw } from 'lucide-react';
import { profile } from '@/data/profile';
import AboutLikeButton from '@/components/AboutLikeButton';
import { useContact } from './ContactProvider';

const questions = [
  {
    question: 'How did you get started?',
    answer: 'Google Sites, back in 2017. That was my first website. In 2024, I started learning React.',
    link: '/experience', label: 'See the journey', aside: 'From dragging blocks to writing components.',
  },
  {
    question: 'What connects your projects?',
    answer: 'Real situations: reporting mosquito breeding sites, monitoring farm pests, and helping people understand energy use.',
    link: '/projects', label: 'Explore the work', aside: 'Different problems. Something useful to build.',
  },
  {
    question: 'What are you curious about?',
    answer: 'Where AI can actually help. I’m exploring it through applications, including a camera-based face-identification prototype.',
    link: '/projects/memowee', label: 'See the experiment', aside: 'Learning by trying things out.',
  },
  {
    question: 'Can we build something?',
    answer: 'A project idea, an opportunity, or something you’re figuring out? Let’s talk.',
    link: `mailto:${profile.email}`, label: 'Start a conversation', aside: 'Your question can be the next one.',
  },
];

export default function AboutNotebook() {
  const { openContact } = useContact();
  const [selected, setSelected] = useState(0);
  const [pending, setPending] = useState(false);
  const [visited, setVisited] = useState<number[]>([0]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotion = useReducedMotion();
  const current = questions[selected];
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function ask(index: number) {
    if (index === selected && !pending) return;
    if (timer.current) clearTimeout(timer.current);
    setSelected(index);
    setVisited(previous => previous.includes(index) ? previous : [...previous, index]);
    setPending(!reducedMotion);
    if (!reducedMotion) timer.current = setTimeout(() => setPending(false), 450);
  }
  function reset() {
    if (timer.current) clearTimeout(timer.current);
    setPending(false);
    setSelected(0);
    setVisited([0]);
  }

  return (
    <div className="bg-transparent">
      <div className="mb-7 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full border border-accent/30 text-accent"><MessageCircle className="size-4" aria-hidden="true" /></span>
          <div><h3 className="text-sm font-medium text-strong">Let’s skip the long bio.</h3><p className="mt-1 text-xs text-muted">Pick a question below.</p></div>
        </div>
        <button type="button" onClick={reset} aria-label="Restart the questions" title="Start over" className="flex size-11 shrink-0 items-center justify-center rounded-full text-subtle transition-colors hover:text-accent"><RotateCcw className="size-4" aria-hidden="true" /></button>
      </div>

      <div className="grid gap-7 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.25fr)] sm:gap-8">
        <div className="flex flex-col gap-1" role="group" aria-label="Questions about Axel">
          {questions.map(({ question }, index) => <button key={question} type="button" onClick={() => ask(index)} aria-pressed={selected === index} aria-controls="about-answer" className={`group relative flex min-h-14 items-center gap-3 rounded-r-xl border-l-2 py-3 pl-4 pr-3 text-left text-sm transition-colors ${selected === index ? 'border-accent text-accent' : 'border-transparent text-muted hover:border-accent/30 hover:text-foreground'}`}>
            <span className="min-w-0 flex-1 leading-6">{question}</span>
            {selected === index ? <motion.span layoutId="about-question-pointer" transition={{ duration: reducedMotion ? 0 : 0.25 }}><CornerDownLeft className="size-4" aria-hidden="true" /></motion.span> : <span aria-hidden="true" className={`size-1 shrink-0 rounded-full ${visited.includes(index) ? 'bg-accent/60' : 'bg-line-strong'}`} />}
          </button>)}
        </div>

        <div className="min-w-0 border-t border-line pt-6 sm:border-l sm:border-t-0 sm:pl-7 sm:pt-0">
          <div className="mb-5 flex items-center gap-3">
            <div className="relative size-10 shrink-0 overflow-hidden rounded-full ring-1 ring-accent/30"><Image src="/assets/profile_xelpaxu.jpg" alt="" fill sizes="40px" className="object-cover" /></div>
            <div><p className="text-sm font-medium">Axel</p><p className="mt-0.5 text-[11px] text-subtle">A few quick answers</p></div>
          </div>
          <div id="about-answer" role="region" aria-label={`Axel’s answer: ${current.question}`} aria-live="polite" aria-busy={pending} className="min-h-[210px]">
            <AnimatePresence mode="wait" initial={false}>
              {pending ? <motion.div key="thinking" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-14 items-center gap-1.5">
                {[0, 1, 2].map(index => <motion.span key={index} className="size-1.5 rounded-full bg-accent" animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.6, repeat: Infinity, delay: index * 0.1 }} />)}
              </motion.div> : <motion.div key={selected} initial={{ opacity: 0, y: reducedMotion ? 0 : 10, filter: reducedMotion ? 'none' : 'blur(3px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}>
                <p className="text-lg leading-8 tracking-tight text-strong">{current.answer}</p>
                <p className="mt-4 text-xs leading-6 text-muted">{current.aside}</p>
                <Link href={current.link} onClick={event => { if (current.link?.startsWith('mailto:')) { event.preventDefault(); openContact(); } }} className="mt-4 inline-flex min-h-11 items-center gap-2 text-xs font-medium text-accent hover:underline">{current.label}<ArrowUpRight className="size-3.5" aria-hidden="true" /></Link>
              </motion.div>}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <AboutLikeButton />
    </div>
  );
}

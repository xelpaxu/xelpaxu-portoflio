"use client";

import Image from 'next/image';
import PokeButton from '@/components/PokeButton';
import { profile } from '@/data/profile';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { Download } from 'lucide-react';
import { FaFacebookF, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { IoMdMail } from 'react-icons/io';

export default function HeroSidebar() {
  const technologies = [
    { name: 'React', logo: '/assets/logos/reacticon.svg' },
    { name: 'Next.js', logo: '/assets/logos/nextjsicon.png' },
    { name: 'TypeScript', logo: '/assets/logos/typescripticon.svg' },
    { name: 'Flutter', logo: '/assets/logos/fluttericon.svg' },
    { name: 'React Native', logo: '/assets/logos/reacticon.svg' },
  ];
  const [resumeActive, setResumeActive] = useState(false);
  const resumeX = useSpring(0, { stiffness: 300, damping: 22 });
  const resumeY = useSpring(0, { stiffness: 300, damping: 22 });
  function resetResume() { setResumeActive(false); resumeX.set(0); resumeY.set(0); }
  const reducedMotion = useReducedMotion();
  const portraitX = useSpring(0, { stiffness: 180, damping: 22 });
  const portraitY = useSpring(0, { stiffness: 180, damping: 22 });
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);
  const leftX = useMotionValue(0);
  const leftY = useMotionValue(0);
  const rightX = useMotionValue(0);
  const rightY = useMotionValue(0);

  function movePortrait(event: PointerEvent<HTMLAnchorElement>) {
    if (reducedMotion || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    portraitX.set((event.clientX - rect.left - rect.width / 2) * 0.07);
    portraitY.set((event.clientY - rect.top - rect.height / 2) * 0.07);
  }
  function resetPortrait() { portraitX.set(0); portraitY.set(0); }

  useEffect(() => {
    if (reducedMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let frame = 0;
    const followPointer = (event: globalThis.PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        for (const [ref, x, y] of [[leftEyeRef, leftX, leftY], [rightEyeRef, rightX, rightY]] as const) {
          if (!ref.current) continue;
          const rect = ref.current.getBoundingClientRect();
          const dx = event.clientX - rect.left - rect.width / 2;
          const dy = event.clientY - rect.top - rect.height / 2;
          const distance = Math.hypot(dx, dy) || 1;
          const strength = Math.min(1, distance / 80);
          x.set(dx / distance * 5 * strength);
          y.set(dy / distance * 4 * strength);
        }
      });
    };
    window.addEventListener('pointermove', followPointer, { passive: true });
    return () => { window.removeEventListener('pointermove', followPointer); cancelAnimationFrame(frame); leftX.set(0); leftY.set(0); rightX.set(0); rightY.set(0); };
  }, [reducedMotion, leftX, leftY, rightX, rightY]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center gap-5 lg:justify-start">
        <PokeButton>
        <motion.a
          href="#about"
          aria-label="Get to know Axel"
          title="Get to know me"
          onPointerMove={movePortrait}
          onPointerLeave={resetPortrait}
          onPointerCancel={resetPortrait}
          onBlur={resetPortrait}
          whileTap={reducedMotion ? undefined : { scale: 0.97 }}
          className="group relative block size-24 shrink-0 rounded-full ring-1 ring-line ring-offset-4 ring-offset-page transition-[box-shadow] hover:ring-line-strong focus-visible:ring-line-strong"
        >
          <span className="absolute inset-0 overflow-hidden rounded-full">
            <motion.span className="absolute -inset-1" style={{ x: reducedMotion ? 0 : portraitX, y: reducedMotion ? 0 : portraitY }}>
              <Image src="/assets/profile_xelpaxu.jpg" alt="Axel John Nuqui" fill sizes="104px" className="object-cover" priority />
            </motion.span>
          </span>

        </motion.a>
        </PokeButton>
      </div>
      <div>
        <h1 className="font-display text-5xl font-bold tracking-tight lg:text-[2.8rem]">Axel John Nuqui</h1>
        <p className="mt-2 text-lg leading-7 text-muted">Aspiring Full Stack AI Engineer</p>
        <p className="mt-2 text-sm text-subtle">{profile.location}</p>
      </div>

      {/* Bio */}
      <div className="max-w-sm leading-[2rem] text-muted text-sm">
        I&apos;m building web and mobile applications using{" "}
        {technologies.map((tech, index) => (
          <span key={tech.name}>
            <span className="inline-flex items-center gap-1.5 rounded-[0.5rem] border border-dashed border-line-strong bg-surface-raised px-2.5 py-[0.2rem] text-sm text-strong transition-all hover:scale-105 hover:border-line-strong hover:bg-foreground/20">
              <span className="relative h-4 w-4 inline-block">
                <Image
                  src={tech.logo}
                  alt={`${tech.name} logo`}
                  fill
                  sizes="16px"
                  className="object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </span>
              <span className='font-bold'>{tech.name}</span>
            </span>
            {index < technologies.length - 1 && " , "}
          </span>
        ))}
        {" "}and passionate about creating solutions that will solve real-world problems.
      </div>

      {/* Quick Links & Actions */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 -mt-5">
        <motion.a
          href="/NUQUI_CV.pdf"
          aria-label="Open Axel’s resume PDF (opens in a new tab)"
          onPointerEnter={() => setResumeActive(true)}
          onPointerMove={event => { if (reducedMotion || event.pointerType !== 'mouse') return; const rect = event.currentTarget.getBoundingClientRect(); resumeX.set((event.clientX - rect.left - rect.width / 2) * 0.045); resumeY.set((event.clientY - rect.top - rect.height / 2) * 0.07); }}
          onPointerLeave={resetResume}
          onPointerCancel={resetResume}
          onFocus={() => setResumeActive(true)}
          onBlur={resetResume}
          whileTap={reducedMotion ? undefined : { scale: 0.96 }}
          style={{ x: reducedMotion ? 0 : resumeX, y: reducedMotion ? 0 : resumeY }}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex w-fit items-center gap-3 rounded-full border border-accent/50 bg-transparent px-5 py-2.5 text-sm font-medium text-accent transition hover:bg-surface hover:text-foreground"
        >
          <span className="relative block h-5 w-[78px] overflow-hidden"><motion.span animate={{ y: resumeActive ? -20 : 0 }} transition={{ duration: reducedMotion ? 0 : 0.2 }} className="block"><span className="block h-5">Resume</span><span aria-hidden="true" className="block h-5">Take a look</span></motion.span></span>
          
          {/* Eyes Container */}
          <div aria-hidden="true" className="flex gap-1 bg-transparent" style={{ transform: resumeActive && !reducedMotion ? 'scale(1.12)' : 'scale(1)', transition: reducedMotion ? 'none' : 'transform 180ms ease' }}>
            {/* Left Eye */}
            <div 
              ref={leftEyeRef}
              className="hero-eye-blink relative h-5 w-5 p-px rounded-full border border-foreground bg-page origin-center"
            >
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                style={{ x: leftX, y: leftY }}
              >
                <div className="h-1.5 w-1.5 rounded-full bg-foreground shrink-0" />
              </motion.div>
            </div>

            {/* Right Eye */}
            <div 
              ref={rightEyeRef}
              className="hero-eye-blink relative flex h-5 w-5 p-px rounded-full border border-foreground bg-page origin-center"
            >
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                style={{ x: rightX, y: rightY }}
              >
                <div className="h-1.5 w-1.5 rounded-full bg-foreground shrink-0" />
              </motion.div>
            </div>
          </div>
        </motion.a>
        <motion.a href="/NUQUI_CV.pdf" download="Axel-John-Nuqui-Resume.pdf" aria-label="Download Axel’s resume PDF" title="Download resume" whileHover={reducedMotion ? undefined : { y: 2 }} whileTap={reducedMotion ? undefined : { scale: 0.9 }} className="flex size-11 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent"><Download className="size-4" aria-hidden="true" /></motion.a>
        </div>

        <div className="flex items-center gap-2">
        <a
          href={`mailto:${profile.email}`}
          className="inline-flex w-fit items-center justify-center rounded-lg bg-accent px-6 py-2 text-sm font-medium text-accent-ink transition hover:bg-action-hover"
        >
          Get in Touch
        </a>
        </div>

        {/* Social Icons Array */}
        <div className="flex items-center gap-2 pt-1">
          <a
            href="https://linkedin.com/in/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-lg bg-transparent text-muted transition hover:bg-surface hover:text-foreground"
            aria-label="LinkedIn"
          >
            <FaLinkedinIn size={18} />
          </a>
          <a
            href="https://facebook.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-lg bg-transparent text-muted transition hover:bg-surface hover:text-foreground"
            aria-label="Facebook"
          >
            <FaFacebookF size={18} />
          </a>
          <a
            href={`https://github.com/${profile.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-lg bg-transparent text-muted transition hover:bg-surface hover:text-foreground"
            aria-label="GitHub"
          >
            <FaGithub size={18} />
          </a>

          <a
            href={`mailto:${profile.email}`}
            className="flex h-11 w-11 items-center justify-center rounded-lg bg-transparent text-muted transition hover:bg-surface hover:text-foreground"
            aria-label="Email"
          >
            <IoMdMail size={20} />
          </a>
        </div>
      </div>
    </div>
  );
}

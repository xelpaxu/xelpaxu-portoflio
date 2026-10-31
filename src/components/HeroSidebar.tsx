"use client";

import Image from 'next/image';
import { profile } from '@/data/profile';
import { useEffect, useRef, type PointerEvent } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { ArrowDownRight } from 'lucide-react';
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
      <div className="flex justify-center lg:justify-start">
        <motion.a
          href="#about"
          aria-label="Get to know Axel"
          title="Get to know me"
          onPointerMove={movePortrait}
          onPointerLeave={resetPortrait}
          onPointerCancel={resetPortrait}
          onBlur={resetPortrait}
          whileTap={reducedMotion ? undefined : { scale: 0.97 }}
          className="group relative block size-24 rounded-full ring-1 ring-line ring-offset-4 ring-offset-page transition-[box-shadow] hover:ring-line-strong focus-visible:ring-line-strong"
        >
          <span className="absolute inset-0 overflow-hidden rounded-full">
            <motion.span className="absolute -inset-1" style={{ x: reducedMotion ? 0 : portraitX, y: reducedMotion ? 0 : portraitY }}>
              <Image src="/assets/profile.jpg" alt="Axel John Nuqui" fill sizes="104px" className="object-cover" priority />
            </motion.span>
          </span>
          <span aria-hidden="true" className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border border-line bg-page text-muted transition-colors group-hover:border-line-strong group-hover:text-foreground group-focus-visible:text-foreground"><ArrowDownRight className="size-3.5" /></span>
        </motion.a>
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
            <span className="inline-flex items-center gap-1.5 rounded-[0.5rem] border border-dashed border-line-strong bg-surface-raised backdrop-blur-xl px-2.5 py-[0.2rem] text-sm text-strong transition-all hover:scale-105 hover:border-line-strong hover:bg-foreground/20">
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
        {/* Matte Black Resume Button */}
        <a
          href="/NUQUI_CV.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex w-fit items-center gap-3 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium text-strong transition hover:bg-surface hover:text-foreground"
        >
          <span>Resume</span>
          
          {/* Eyes Container */}
          <div className="flex gap-1 bg-transparent">
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
        </a>

        {/* White Get in Touch Button */}
        <a
          href={`mailto:${profile.email}`}
          className="inline-flex w-fit items-center justify-center rounded-lg bg-foreground px-6 py-2 text-sm font-medium text-inverse transition hover:bg-action-hover"
        >
          Get in Touch
        </a>

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

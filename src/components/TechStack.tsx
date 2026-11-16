'use client';

import { motion } from 'framer-motion';
import TechnologyLogo from '@/components/TechnologyLogo';
import InteractiveStackLogo from '@/components/InteractiveStackLogo';
import { getTechnology } from '@/lib/technology-logos';
import { playThock } from '@/lib/thock';

export default function TechStack({ tags, iconOnly = false, animated = false, interactive = false, goTo = [], keycaps = false }: {
  tags: string[];
  iconOnly?: boolean;
  animated?: boolean;
  interactive?: boolean;
  goTo?: string[];
  keycaps?: boolean;
}) {
  return <motion.ul aria-label="Technologies" className={`flex flex-wrap items-center gap-y-3 ${iconOnly ? 'gap-x-4' : 'gap-x-5'}`}
    variants={animated ? {
      visible: { transition: { staggerChildren: 0.018, delayChildren: 0.02 } },
      exit: { transition: { staggerChildren: 0.005, staggerDirection: -1 } },
    } : undefined}>
    {tags.map((tag, index) => {
      const technology = getTechnology(tag);
      const preferred = goTo.includes(tag);
      const logo = <TechnologyLogo key={technology.src ?? tag} src={technology.src} monochrome={technology.monochrome} qr={tag === 'QR'} className={`${iconOnly ? 'size-[18px]' : 'size-4'} shrink-0`} />;
      const displayLogo = interactive ? <InteractiveStackLogo preferred={preferred}>{logo}</InteractiveStackLogo> : logo;
      const content = <>
        {animated ? <motion.span className="stack-logo" variants={{
          hidden: { opacity: 0, scale: 0.45, rotate: index % 2 ? 14 : -14, y: 14 },
          visible: { opacity: 1, scale: 1, rotate: 0, y: 0, transition: { type: 'spring', stiffness: 380, damping: 21, mass: 0.65 } },
          exit: { opacity: 0, scale: 0.65, rotate: index % 2 ? -12 : 12, y: -8, transition: { duration: 0.12 } },
        }}>{displayLogo}</motion.span> : displayLogo}
        <motion.span className={iconOnly ? 'sr-only' : undefined} variants={animated ? {
          hidden: { opacity: 0, y: 5 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.18, delay: 0.05 } },
          exit: { opacity: 0, transition: { duration: 0.08 } },
        } : undefined}>
          {technology.label}
          {preferred && <span className="sr-only"> — Go-to choice for new projects</span>}
        </motion.span>
      </>;
      return <motion.li key={tag} title={preferred ? `${technology.label} — Go-to choice for new projects` : technology.label} className="inline-flex items-center gap-2 text-xs text-muted"
        variants={animated ? { hidden: {}, visible: {}, exit: {} } : undefined}>
        {keycaps
          ? <>
            <button type="button" onClick={playThock} className="stack-keycap" aria-label={technology.label}>{displayLogo}</button>
            <motion.span variants={animated ? {
              hidden: { opacity: 0, y: 5 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.18, delay: 0.05 } },
              exit: { opacity: 0, transition: { duration: 0.08 } },
            } : undefined}>
              {technology.label}
              {preferred && <span className="sr-only"> — Go-to choice for new projects</span>}
            </motion.span>
          </>
          : content}
      </motion.li>;
    })}
  </motion.ul>;
}

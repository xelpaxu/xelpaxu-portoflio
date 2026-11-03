"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { BriefcaseBusiness, Folder, Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import AccentPicker from './AccentPicker';
import PortfolioSearch from './PortfolioSearch';

export default function Navbar() {
  const reducedMotion = useReducedMotion();
  const { theme, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Handle Ctrl+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle scroll to shrink navbar width
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll(); // run once in case page loads already scrolled
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine active section based on current path
  const getActiveSection = () => {
    if (pathname === '/') return 'profile';
    if (pathname.startsWith('/experience')) return 'experience';
    if (pathname.startsWith('/projects')) return 'projects';
    if (pathname.startsWith('/blog')) return 'blog';
    return 'profile';
  };

  const activeSection = getActiveSection();

  return (
    <>
      {/* Floating Navbar */}
      <motion.div
        initial={false}
        animate={{
          width: isScrolled ? 640 : 880,
        }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="border-line bg-surface fixed left-1/2 top-6 -translate-x-1/2 rounded-2xl border-[0.5px] shadow-navigation backdrop-blur-xl z-50 h-14 md:h-[65px] md:rounded-3xl max-w-[calc(100%_-_2rem)]"
      >
        <div className="flex h-full items-center justify-between px-2 md:px-4">
          {/* Left group - Profile, Experience, Projects */}
          <div className="flex items-center gap-1 md:gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-full px-2 py-1.5 transition-all duration-300"
            >
              <div className="relative h-6 w-6 overflow-hidden rounded-[10px] md:h-7 md:w-7">
                <Image
                  src="/assets/logos/navbar-icon.jpg"
                  alt="Profile"
                  sizes="28px"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="hidden text-base font-bold text-foreground transition-all duration-300 hover:brightness-75 sm:inline-block">
                xelpaxu
              </span>
            </Link>

            <Link
              href="/experience"
              aria-label="Experience"
              title="Experience"
              className={`inline-flex min-h-11 items-center rounded-full px-2 py-1.5 text-xs font-medium transition-all duration-300 md:px-3 md:text-base ${
                activeSection === 'experience'
                  ? 'text-accent'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <BriefcaseBusiness className="size-4 min-[400px]:hidden" aria-hidden="true" /><span className="hidden min-[400px]:inline">Experience</span>
            </Link>

            <Link
              href="/projects"
              aria-label="Projects"
              title="Projects"
              className={`inline-flex min-h-11 items-center rounded-full px-2 py-1.5 text-xs font-medium transition-all duration-300 md:px-3 md:text-base ${
                activeSection === 'projects'
                  ? 'text-accent'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <Folder className="size-4 min-[400px]:hidden" aria-hidden="true" /><span className="hidden min-[400px]:inline">Projects</span>
            </Link>
            <Link href="/blog" aria-current={activeSection === 'blog' ? 'page' : undefined} className={`inline-flex min-h-11 items-center rounded-full px-2 py-1.5 text-xs font-medium transition-all duration-300 md:px-3 md:text-base ${activeSection === 'blog' ? 'text-accent' : 'text-muted hover:text-foreground'}`}>Blog</Link>
          </div>

          {/* Right group - Search */}
          <div className="flex items-center gap-2 md:gap-3">
            <AccentPicker />
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="flex size-11 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-raised hover:text-foreground"
            >
              <motion.span
                key={theme}
                className="flex"
                initial={reducedMotion ? false : { opacity: 0, rotate: -65, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                transition={{ duration: reducedMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {theme === 'dark' ? <Sun aria-hidden="true" className="size-5" /> : <Moon aria-hidden="true" className="size-5" />}
              </motion.span>
            </button>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden items-center gap-1 rounded-lg border border-line bg-surface-raised px-2 py-1.5 transition-all duration-300 hover:border-line-strong hover:bg-surface-hover sm:flex md:gap-2 md:px-3"
            >
              <span className="text-xs text-muted transition-colors group-hover:text-foreground md:text-sm">
                Search
              </span>
              <span className="hidden text-[10px] font-medium text-subtle md:inline-block">
                Ctrl + K
              </span>
            </button>
          </div>
        </div>
      </motion.div>

      {isSearchOpen && <PortfolioSearch onClose={() => setIsSearchOpen(false)} />}
    </>
  );
}

"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

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
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine active section based on current path
  const getActiveSection = () => {
    if (pathname === '/') return 'profile';
    if (pathname.startsWith('/experience')) return 'experience';
    if (pathname.startsWith('/projects')) return 'projects';
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
                  src="/assets/profile.jpg"
                  alt="Profile"
                  sizes="28px"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="hidden text-base font-bold text-foreground transition-all duration-300 hover:brightness-75 sm:inline-block">
                xelpaxu | Axel
              </span>
            </Link>

            <Link
              href="/experience"
              className={`rounded-full px-2 py-1.5 text-xs font-medium transition-all duration-300 md:px-3 md:text-base ${
                activeSection === 'experience'
                  ? 'text-foreground'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              Experience
            </Link>

            <Link
              href="/projects"
              className={`rounded-full px-2 py-1.5 text-xs font-medium transition-all duration-300 md:px-3 md:text-base ${
                activeSection === 'projects'
                  ? 'text-foreground'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              Projects
            </Link>
          </div>

          {/* Right group - Search */}
          <div className="flex items-center gap-2 md:gap-3">
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
              className="flex items-center gap-1 rounded-lg border border-line bg-surface-raised px-2 py-1.5 transition-all duration-300 hover:border-line-strong hover:bg-surface-hover md:gap-2 md:px-3"
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

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-scrim backdrop-blur-sm">
          <div className="mt-24 w-full max-w-md rounded-xl border border-line bg-page shadow-dialog">
            <div className="flex items-center gap-3 border-b border-line p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5 text-subtle"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search pages, projects, or experience..."
                className="flex-1 bg-transparent text-foreground outline-none placeholder:text-subtle"
                autoFocus
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="rounded border border-line px-2 py-1 text-xs text-muted transition-colors hover:border-line-strong hover:text-foreground"
              >
                Esc
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto p-2">
              <div className="p-4 text-center text-sm text-subtle">
                Type to search...
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

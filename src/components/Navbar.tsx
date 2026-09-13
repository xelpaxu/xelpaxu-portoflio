"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Navbar() {
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
    if (pathname === '/experience') return 'experience';
    if (pathname === '/projects') return 'projects';
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
        className="border-border/20 border-zinc-800 bg-zinc-950 fixed left-1/2 top-6 -translate-x-1/2 rounded-2xl border-[0.5px] shadow-lg backdrop-blur-xl z-50 md:h-[65px] md:rounded-3xl max-w-[calc(100%-2rem)]"
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
                  fill
                  className="object-cover"
                />
              </div>
              <span className="hidden text-base font-bold text-white transition-all duration-300 hover:brightness-75 sm:inline-block">
                Axel John
              </span>
            </Link>

            <Link
              href="/experience"
              className={`rounded-full px-2 py-1.5 text-xs font-medium transition-all duration-300 md:px-3 md:text-base ${
                activeSection === 'experience'
                  ? 'bg-white/10 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Experience
            </Link>

            <Link
              href="/projects"
              className={`rounded-full px-2 py-1.5 text-xs font-medium transition-all duration-300 md:px-3 md:text-base ${
                activeSection === 'projects'
                  ? 'bg-white/10 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Projects
            </Link>
          </div>

          {/* Right group - Search */}
          <div className="flex items-center gap-2 md:gap-3">

            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-1 rounded-lg border border-zinc-700/50 bg-black/40 px-2 py-1.5 transition-all duration-300 hover:border-zinc-600 hover:bg-black/60 md:gap-2 md:px-3"
            >
              <span className="text-xs text-zinc-400 transition-colors group-hover:text-white md:text-sm">
                Search
              </span>
              <span className="hidden text-[10px] font-medium text-zinc-500 md:inline-block">
                Ctrl + K
              </span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm">
          <div className="mt-24 w-full max-w-md rounded-xl border border-zinc-700/50 bg-black shadow-2xl">
            <div className="flex items-center gap-3 border-b border-zinc-800/50 p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5 text-zinc-500"
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
                className="flex-1 bg-transparent text-white outline-none placeholder:text-zinc-500"
                autoFocus
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="rounded border border-zinc-700/50 px-2 py-1 text-xs text-zinc-400 transition-colors hover:border-zinc-600 hover:text-white"
              >
                Esc
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto p-2">
              <div className="p-4 text-center text-sm text-zinc-500">
                Type to search...
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
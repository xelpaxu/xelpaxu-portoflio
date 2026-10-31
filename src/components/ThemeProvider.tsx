'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { flushSync } from 'react-dom';

type Theme = 'dark' | 'light';
const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void } | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitioning = useRef(false);

  useEffect(() => {
    const syncTheme = () => setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
    syncTheme();
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'portfolio-theme') {
        document.documentElement.dataset.theme = event.newValue === 'light' ? 'light' : 'dark';
        syncTheme();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('storage', onStorage);
      if (transitionTimer.current) clearTimeout(transitionTimer.current);
      delete document.documentElement.dataset.themeTransition;
    };
  }, []);

  const toggleTheme = async () => {
    if (transitioning.current) return;
    const next = theme === 'dark' ? 'light' : 'dark';
    const applyTheme = () => {
      flushSync(() => {
        document.documentElement.dataset.theme = next;
        setTheme(next);
      });
      try { localStorage.setItem('portfolio-theme', next); } catch { /* Storage is optional. */ }
    };
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) { applyTheme(); return; }

    if (!document.startViewTransition) {
      // Older browsers get a short color fade without cloning the page.
      document.documentElement.dataset.themeTransition = '';
      void document.documentElement.offsetWidth;
      applyTheme();
      if (transitionTimer.current) clearTimeout(transitionTimer.current);
      transitionTimer.current = setTimeout(() => {
        delete document.documentElement.dataset.themeTransition;
      }, 500);
      return;
    }

    transitioning.current = true;
    try {
      const transition = document.startViewTransition(applyTheme);
      // Snapshot both themes once; animate the reveal without rerendering the page.
      await transition.ready;
      const radius = Math.hypot(window.innerWidth, window.innerHeight);
      await document.documentElement.animate(
        { clipPath: ['circle(0px at 100% 0%)', `circle(${radius}px at 100% 0%)`] },
        {
          duration: 850,
          easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
          fill: 'both',
          pseudoElement: '::view-transition-new(root)',
        },
      ).finished;
      await transition.finished;
    } catch {
      // A skipped snapshot (for example in a hidden tab) still applies the theme.
      if (document.documentElement.dataset.theme !== next) applyTheme();
    } finally {
      transitioning.current = false;
    }
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme requires ThemeProvider');
  return context;
}

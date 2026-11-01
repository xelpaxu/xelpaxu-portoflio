'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';

const ShaderCanvas = dynamic(() => import('./ShaderCanvas'), { ssr: false });

export function ShaderBackground() {
  const { theme } = useTheme();
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
    let timer: ReturnType<typeof setTimeout>;
    const sync = () => {
      clearTimeout(timer);
      // Let content and the startup reveal render before loading WebGL.
      timer = setTimeout(() => setAnimated(preference.matches), preference.matches ? 3800 : 0);
    };
    sync();
    preference.addEventListener('change', sync);
    return () => { clearTimeout(timer); preference.removeEventListener('change', sync); };
  }, []);

  return <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
    {theme === 'light' ? <div className="light-grid" /> : <>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#171719_0%,#000_75%)]" />
      {animated && <ShaderCanvas />}
    </>}
  </div>;
}

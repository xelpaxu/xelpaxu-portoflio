import type { ReactNode } from 'react';
import { ShaderBackground } from '@/components/ShaderBackground';
import { GrainOverlay } from '@/components/GrainOverlay';
import Navbar from '@/components/Navbar';

export default function RouteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <ShaderBackground />
      <GrainOverlay />
      <main id="main-content" className="relative z-10 min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-6xl px-5 pb-20 pt-32 sm:px-6 sm:pb-24 sm:pt-40">{children}<footer className="mt-20 flex flex-wrap justify-between gap-3 border-t border-line pt-6 text-xs text-subtle"><span>Axel John Nuqui</span><span>Iloilo City, Philippines</span></footer></div>
      </main>
    </>
  );
}

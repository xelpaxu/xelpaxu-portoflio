import SiteFooter from '@/components/SiteFooter';
import type { ReactNode } from 'react';
import Navbar from '@/components/Navbar';

export default function RouteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <main id="main-content" className="relative z-10 min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-6xl px-5 pb-20 pt-32 sm:px-6 sm:pb-24 sm:pt-40">{children}<SiteFooter /></div>
      </main>
    </>
  );
}

// app/page.tsx
"use client";

import { ShaderBackground } from '@/components/ShaderBackground';
import { GrainOverlay } from '@/components//GrainOverlay';
import HeroSidebar from "../components/HeroSidebar";
import Navbar from "../components/Navbar";
import ExperienceSection from '../components/experience/ExperienceSection';
import SectionHeader from '../components/SectionHeader';
import ScrollReveal from '../components/ScrollReveal';

export default function HomePage() {
  return (
    <>
      {/* Shader Background - Full screen animated background */}
      <ShaderBackground />
      
      {/* Grain Overlay - On top of shader for texture */}
      <GrainOverlay />

      {/* ===== MAIN CONTENT ===== */}
      <main className="min-h-screen relative z-10">
        <Navbar />
        
        <div className="mx-auto max-w-6xl px-6 py-[8rem]">
          <div className="flex flex-col gap-10 lg:flex-row">
            {/* Left Sidebar */}
            <aside className="w-full lg:w-80 lg:shrink-0">
              <div className="lg:sticky lg:top-24">
                <HeroSidebar />
              </div>
            </aside>

            {/* Right Content */}
            <section className="flex-1 min-w-0">
              <div className="space-y-20">
                {/* Experience Section */}
                <ScrollReveal delay={0.1}>
                  <div>
                    <SectionHeader subtitle="Featured" title="Experience" />
                    <ExperienceSection />
                  </div>
                </ScrollReveal>

                {/* Projects Section */}
                <ScrollReveal delay={0.2}>
                  <div>
                    <SectionHeader subtitle="Featured" title="Projects" />
                    <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/20 p-8 text-center backdrop-blur-sm">
                      <p className="text-zinc-400">Projects section coming soon...</p>
                    </div>
                  </div>
                </ScrollReveal>

                {/* About Section */}
                <ScrollReveal delay={0.3}>
                  <div>
                    <SectionHeader subtitle="Get to know me" title="About" />
                    <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/20 p-8 text-center backdrop-blur-sm">
                      <p className="text-zinc-400">About section coming soon...</p>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Contact Section */}
                <ScrollReveal delay={0.4}>
                  <div>
                    <SectionHeader subtitle="Get in touch" title="Contact" />
                    <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/20 p-8 text-center backdrop-blur-sm">
                      <p className="text-zinc-400">Contact section coming soon...</p>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
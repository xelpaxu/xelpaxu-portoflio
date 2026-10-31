"use client";

import { Code2, Layers, Smartphone } from 'lucide-react';
import { ShaderBackground } from '@/components/ShaderBackground';
import { GrainOverlay } from '@/components/GrainOverlay';
import HeroSidebar from '@/components/HeroSidebar';
import Navbar from '@/components/Navbar';
import ExperienceSection from '@/components/experience/ExperienceSection';
import ProjectsSection from '@/components/projects/ProjectSection';
import SectionHeader from '@/components/SectionHeader';
import GitHubActivity from '@/components/GitHubActivity';
import ContactSection from '@/components/ContactSection';

const interests = [
  { icon: Code2, title: 'Web development', description: 'Interfaces and the systems behind them, built with React, Next.js, and TypeScript.' },
  { icon: Smartphone, title: 'Mobile experiences', description: 'Taking ideas beyond the browser with Flutter and React Native.' },
  { icon: Layers, title: 'Exploring AI', description: 'Learning how AI can become a useful part of everyday applications.' },
];

export default function HomePage() {
  return (
    <>
      <ShaderBackground />
      <GrainOverlay />
      <main id="main-content" className="relative z-10 min-h-screen">
        <Navbar />
        <div className="home-layout mx-auto max-w-6xl px-5 pb-16 pt-32 sm:px-6 sm:pb-24 mt-24">
          <aside className="home-sidebar mt-24" aria-label="About Axel"><HeroSidebar /></aside>
          <div className="home-content min-w-0">
            <div className="space-y-16 sm:space-y-20">
              <section aria-labelledby="experience-heading" className="scroll-mt-28">
                <SectionHeader title="Experience" subtitle="The journey so far" id="experience-heading" />
                <ExperienceSection />
              </section>
              <section id="projects" aria-labelledby="projects-heading" className="scroll-mt-28">
                <SectionHeader title="Featured projects" subtitle="Selected work" id="projects-heading" />
                <ProjectsSection />
              </section>
              <section id="about" aria-labelledby="about-heading" className="scroll-mt-28">
                <SectionHeader title="Get to know me" subtitle="Beyond the code" id="about-heading" />
                <div className="border-l-2 border-line-strong pl-5 sm:pl-6">
                  <p className="text-lg leading-8 tracking-tight text-strong">I’m Axel, a developer based in Iloilo City, Philippines. I like turning real-world problems into useful web and mobile applications.</p>
                  <p className="mt-4 text-sm leading-7 text-muted">My work brings together interfaces, application logic, and a curiosity for AI. I’m interested in how these pieces fit together to make software that feels simple to use.</p>
                </div>
                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  {interests.map(({ icon: Icon, title, description }) => <article key={title} className="border-t border-line bg-transparent pt-5"><Icon className="mb-5 size-5 text-muted" aria-hidden="true" /><h3 className="text-sm font-semibold">{title}</h3><p className="mt-2 text-xs leading-6 text-muted">{description}</p></article>)}
                </div>
              </section>
              <section id="github" aria-labelledby="github-heading" className="scroll-mt-28">
                <SectionHeader title="On GitHub" subtitle="Building in public" id="github-heading" />
                <GitHubActivity />
              </section>
              <section id="contact" aria-labelledby="contact-heading" className="scroll-mt-28">
                <SectionHeader title="Get in touch" subtitle="Start a conversation" id="contact-heading" />
                <ContactSection />
              </section>
            </div>
            <footer className="mt-14 flex flex-wrap justify-between gap-3 border-t border-line pt-6 text-xs text-subtle"><span>Axel John Nuqui</span><span>Iloilo City, Philippines</span></footer>
          </div>
        </div>
      </main>
    </>
  );
}

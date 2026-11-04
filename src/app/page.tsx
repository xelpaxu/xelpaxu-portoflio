import SiteFooter from '@/components/SiteFooter';
import AboutNotebook from '@/components/AboutNotebook';
import HeroSidebar from '@/components/HeroSidebar';
import Navbar from '@/components/Navbar';
import ExperienceSection from '@/components/experience/ExperienceSection';
import ProjectsSection from '@/components/projects/ProjectSection';
import SectionHeader from '@/components/SectionHeader';
import GitHubActivity from '@/components/GitHubActivity';
import ContactSection from '@/components/ContactSection';
import Testimonials from '@/components/Testimonials';

export default function HomePage() {
  return (
    <>
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
              <section id="testimonials" aria-labelledby="testimonials-heading" className="scroll-mt-28">
                <SectionHeader title="Featured testimonials" subtitle="From co-developers" id="testimonials-heading" />
                <Testimonials />
              </section>
              <section id="about" aria-labelledby="about-heading" className="scroll-mt-28">
                <SectionHeader title="Get to know me" subtitle="Beyond the code" id="about-heading" />
                <AboutNotebook />
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
            <SiteFooter />
          </div>
        </div>
      </main>
    </>
  );
}

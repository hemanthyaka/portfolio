import { ParallaxComponent } from '@/components/ui/parallax-scrolling';
import { Navbar } from '@/components/ui/mini-navbar';
import { AboutSection } from '@/components/sections/about';
import { ExperienceSection } from '@/components/sections/experience';
import { SkillsSection } from '@/components/sections/skills';
import { EducationSection } from '@/components/sections/education';
import { ProjectsSection } from '@/components/sections/projects';
import { ServicesSection } from '@/components/sections/services';
import { ContactSection } from '@/components/sections/contact';
import { Hero } from './components/ui/hero-1';
import { CursorGlow } from '@/components/ui/cursor-glow';

function App() {
  return (
    <>
      <ParallaxComponent />
      <Hero
        eyebrow="Frontend Developer"
        title="Crafting interfaces that feel alive"
        subtitle="I turn complex ideas into clean, fast, and accessible web experiences — pixel-perfect UI, smooth animations, and code that scales."
        ctaLabel="See My Work"
        ctaHref="#projects"
      />
      <AboutSection />
      <ExperienceSection />
      <SkillsSection />
      <EducationSection />
      <ProjectsSection />
      <ServicesSection />
      <ContactSection />
      <CursorGlow />
      <Navbar />
    </>
  );
}

export default App;

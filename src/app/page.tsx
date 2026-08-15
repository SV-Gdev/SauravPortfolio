'use client';

import { useState } from 'react';
import Navbar from '@/components/portfolio/Navbar';
import Hero from '@/components/portfolio/Hero';
import FeaturedProject from '@/components/portfolio/FeaturedProject';
import VideoShowcaseSection from '@/components/portfolio/VideoShowcaseSection';
import ProjectsSection from '@/components/portfolio/ProjectsSection';
import ResearchSection from '@/components/portfolio/ResearchSection';
import AboutSection from '@/components/portfolio/AboutSection';
import ContactSection from '@/components/portfolio/ContactSection';
import Footer from '@/components/portfolio/Footer';
import AdminModal from '@/components/portfolio/AdminModal';

export default function Home() {
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onOpenAdmin={() => setAdminOpen(true)} />
      <main className="flex-1">
        <Hero />
        <FeaturedProject />
        <VideoShowcaseSection />
        <ProjectsSection />
        <ResearchSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
      <AdminModal isOpen={adminOpen} onClose={() => setAdminOpen(false)} />
    </div>
  );
}

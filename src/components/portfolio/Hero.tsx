'use client';

import Hero3DCanvas from '@/components/portfolio/Hero3DCanvas';

const techStack = ['Unity', 'Unreal Engine', 'C#', 'C/C++', 'Python', 'SQL'];

export default function Hero() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center px-6 sm:px-12 pt-32 pb-16 relative overflow-hidden"
    >
      {/* Animated background blobs */}
      <div className="absolute -top-1/2 -right-[20%] w-[800px] h-[800px] rounded-full animate-hero-blob-1 pointer-events-none" />
      <div className="absolute -bottom-[30%] -left-[10%] w-[600px] h-[600px] rounded-full animate-hero-blob-2 pointer-events-none" />

      <div className="max-w-[1280px] w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Column: Hero Copy & Actions */}
        <div className="lg:col-span-7 text-center lg:text-left">
          <span className="inline-flex items-center gap-2 px-6 py-2.5 bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.3)] rounded-full text-[0.9rem] text-[var(--accent-primary)] mb-8 font-medium tracking-wider shadow-[0_0_20px_rgba(0,212,255,0.15)]">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-primary)] animate-ping" />
            🎮 Game Developer | Unity & Unreal Engine
          </span>

          <h1 className="text-[clamp(2.5rem,5.5vw,4.8rem)] font-extrabold leading-[1.1] mb-6 tracking-tight">
            Hi, I&apos;m{' '}
            <span className="bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
              Saurav Sharma
            </span>
          </h1>

          <p className="text-[1.25rem] sm:text-[1.35rem] text-[var(--text-secondary)] mb-8 font-normal max-w-[650px] leading-relaxed mx-auto lg:mx-0">
            Aspiring game developer with 1.5+ years of experience in Unity and 7 months
            in Unreal Engine. Building immersive experiences through interactable UI,
            intelligent AI, and polished gameplay systems.
          </p>

          <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-10">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-5 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-[0.9rem] text-[var(--text-secondary)] font-mono font-medium transition-all duration-300 hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] hover:-translate-y-0.5 cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex gap-4 justify-center lg:justify-start flex-wrap">
            <a
              href="#projects"
              onClick={(e) => handleClick(e, '#projects')}
              className="px-10 py-4 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white no-underline rounded-xl font-semibold text-base transition-all duration-300 shadow-[0_4px_20px_rgba(0,212,255,0.3)] border-none cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,212,255,0.4)]"
            >
              View My Projects 🎮
            </a>
            <a
              href="#contact"
              onClick={(e) => handleClick(e, '#contact')}
              className="px-10 py-4 bg-transparent text-[var(--text-primary)] no-underline rounded-xl font-semibold text-base transition-all duration-300 border-2 border-[var(--border-color)] cursor-pointer hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] hover:-translate-y-0.5"
            >
              Get In Touch 💬
            </a>
          </div>
        </div>

        {/* Right Column: Interactive 3D WebGL Viewport */}
        <div className="lg:col-span-5 w-full flex justify-center">
          <Hero3DCanvas />
        </div>
      </div>
    </section>
  );
}

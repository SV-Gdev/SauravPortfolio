'use client';

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
      className="min-h-screen flex items-center justify-center px-8 pt-32 pb-16 relative overflow-hidden"
    >
      {/* Animated background blobs */}
      <div className="absolute -top-1/2 -right-[20%] w-[800px] h-[800px] rounded-full animate-hero-blob-1 pointer-events-none" />
      <div className="absolute -bottom-[30%] -left-[10%] w-[600px] h-[600px] rounded-full animate-hero-blob-2 pointer-events-none" />

      <div className="max-w-[900px] text-center relative z-10">
        <span className="inline-block px-6 py-2 bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.3)] rounded-full text-[0.9rem] text-[var(--accent-primary)] mb-8 font-medium tracking-wider">
          🎮 Game Developer | Unity & Unreal Engine
        </span>

        <h1 className="text-[clamp(3rem,7vw,5.5rem)] font-extrabold leading-[1.1] mb-6 tracking-tight">
          Hi, I&apos;m{' '}
          <span className="bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
            Saurav Sharma
          </span>
        </h1>

        <p className="text-[1.35rem] text-[var(--text-secondary)] mb-8 font-normal max-w-[700px] mx-auto leading-relaxed">
          Aspiring game developer with 1.5+ years of experience in Unity and 7 months
          in Unreal Engine. Building immersive experiences through interactable UI,
          intelligent AI, and polished gameplay systems.
        </p>

        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="px-5 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-[0.9rem] text-[var(--text-secondary)] font-mono font-medium transition-all duration-300 hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] hover:-translate-y-0.5 cursor-default"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="#projects"
            onClick={(e) => handleClick(e, '#projects')}
            className="px-10 py-4 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white no-underline rounded-xl font-semibold text-base transition-all duration-300 shadow-[0_4px_20px_rgba(0,212,255,0.3)] border-none cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,212,255,0.4)]"
          >
            View My Projects
          </a>
          <a
            href="#contact"
            onClick={(e) => handleClick(e, '#contact')}
            className="px-10 py-4 bg-transparent text-[var(--text-primary)] no-underline rounded-xl font-semibold text-base transition-all duration-300 border-2 border-[var(--border-color)] cursor-pointer hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] hover:-translate-y-0.5"
          >
            Get In Touch
          </a>
        </div>
      </div>
    </section>
  );
}

'use client';

import { featuredFeatures, featuredProjectMeta, projects } from '@/data/portfolio-data';
import { useProjectStore } from '@/hooks/useProjectStore';
import Card3DEffect from '@/components/portfolio/Card3DEffect';

export default function FeaturedProject() {
  const { getProjectImage } = useProjectStore();
  const shooterProject = projects.find((p) => p.id === 'shooter') || projects[0];
  const coverImage = getProjectImage(shooterProject);

  return (
    <section
      id="featured-project"
      className="bg-[var(--bg-secondary)] rounded-3xl py-16 px-8 sm:px-12 my-16 max-w-[1200px] mx-auto shadow-[var(--shadow-card)] border border-[var(--border-color)] relative z-10"
    >
      <div className="flex items-center gap-4 mb-8">
        <span className="text-4xl">🎮</span>
        <div>
          <div className="text-[0.9rem] text-[var(--accent-primary)] font-semibold uppercase tracking-widest">
            Flagship Project
          </div>
          <h2 className="text-[2.5rem] sm:text-[2.8rem] font-extrabold leading-tight bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
            Shooter Game — Third-Person Action Experience
          </h2>
        </div>
      </div>

      <p className="text-[1.15rem] text-[var(--text-secondary)] mb-10 max-w-[800px] leading-[1.8]">
        A fully-featured third-person action shooter showcasing advanced game development
        skills. This project demonstrates expertise in enemy AI programming, inventory
        management systems, and persistent save/load functionality — all built from the ground
        up in Unity.
      </p>

      {/* Editable Project Cover Image with 3D Tilt Effect */}
      <Card3DEffect intensity={8} className="mb-12">
        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border-2 border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl group">
          <div className="absolute top-4 left-4 px-4 py-1.5 bg-[rgba(0,0,0,0.75)] backdrop-blur-md border border-[var(--accent-primary)] rounded-full text-xs font-mono font-bold text-[var(--accent-primary)] z-20">
            ✨ Interactive 3D Cover Viewport
          </div>
          <img
            src={coverImage}
            alt="Shooter Game Cover"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </Card3DEffect>

      {/* Key Features Grid */}
      <div className="grid gap-6 mb-10" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        {featuredFeatures.map((f) => (
          <div
            key={f.title}
            className="p-6 bg-[rgba(255,255,255,0.03)] border border-[var(--border-color)] rounded-xl transition-all duration-300 hover:border-[var(--accent-primary)] hover:bg-[rgba(0,212,255,0.05)] hover:translate-x-1"
          >
            <strong className="text-[var(--accent-primary)] block mb-2">
              {f.icon} {f.title}
            </strong>
            {f.description}
          </div>
        ))}
      </div>

      <div className="flex gap-8 flex-wrap mt-8 pt-8 border-t border-[var(--border-color)]">
        {featuredProjectMeta.map((m) => (
          <div key={m.label} className="flex items-center gap-2">
            <span className="text-[var(--text-secondary)] text-[0.9rem]">{m.label}:</span>
            <span className="text-[var(--text-primary)] font-semibold font-mono text-[0.9rem]">
              {m.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

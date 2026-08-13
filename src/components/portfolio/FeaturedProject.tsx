import { featuredFeatures, featuredProjectMeta } from '@/data/portfolio-data';

export default function FeaturedProject() {
  return (
    <section
      id="featured-project"
      className="bg-[var(--bg-secondary)] rounded-3xl py-20 px-12 my-16 max-w-[1200px] mx-auto shadow-[var(--shadow-card)] border border-[var(--border-color)]"
    >
      <div className="flex items-center gap-4 mb-8">
        <span className="text-4xl">🎮</span>
        <div>
          <div className="text-[0.9rem] text-[var(--accent-primary)] font-semibold uppercase tracking-widest">
            Flagship Project
          </div>
          <h2 className="text-[2.8rem] font-extrabold leading-tight bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
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

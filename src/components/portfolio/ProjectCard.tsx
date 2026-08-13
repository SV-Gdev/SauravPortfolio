import type { Project } from '@/data/portfolio-data';

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden transition-all duration-400 shadow-[var(--shadow-card)] hover:-translate-y-2 hover:border-[var(--accent-primary)] hover:shadow-[var(--shadow-glow),var(--shadow-card)]">
      <div className="relative w-full h-[450px] overflow-hidden bg-[var(--bg-secondary)]">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute top-6 left-6 px-5 py-2.5 bg-[rgba(139,92,246,0.9)] backdrop-blur-[10px] rounded-lg text-sm font-semibold text-white z-10">
          {project.roleBadge}
        </span>
      </div>

      <div className="p-10">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-[1.8rem] font-bold leading-tight">{project.title}</h3>
          <span className="px-4 py-1.5 bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.3)] rounded-full text-xs text-[var(--accent-primary)] font-semibold font-mono whitespace-nowrap">
            {project.category}
          </span>
        </div>

        <p className="text-[var(--text-secondary)] text-[1.05rem] leading-[1.8] mb-8">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2.5 mb-8">
          {project.techTags.map((tag) => (
            <span
              key={tag}
              className="px-4 py-1.5 bg-[rgba(255,255,255,0.05)] border border-[var(--border-color)] rounded-md text-sm text-[var(--text-secondary)] font-mono"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-4 flex-wrap">
 {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white no-underline rounded-lg font-semibold text-[0.95rem] transition-all duration-300 border-none cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(0,212,255,0.3)] inline-flex items-center gap-2"
            >
              View on GitHub
            </a>
          )}
          {(project.docsUrl || !project.githubUrl) && (
            <a
              href={project.docsUrl || '#'}
              className="px-7 py-3 bg-transparent text-[var(--text-primary)] no-underline rounded-lg font-semibold text-[0.95rem] transition-all duration-300 border border-[var(--border-color)] cursor-pointer hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] hover:bg-[rgba(0,212,255,0.05)] inline-flex items-center gap-2"
            >
              {project.githubUrl ? 'Documentation' : 'View Details'}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
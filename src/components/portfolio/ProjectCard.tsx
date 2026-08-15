'use client';

import type { Project } from '@/data/portfolio-data';
import { useProjectStore } from '@/hooks/useProjectStore';
import Card3DEffect from '@/components/portfolio/Card3DEffect';

export default function ProjectCard({ project }: { project: Project }) {
  const { getProjectImage } = useProjectStore();
  const coverImage = getProjectImage(project);

  return (
    <Card3DEffect intensity={12}>
      <article className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-[var(--shadow-card)] hover:border-[var(--accent-primary)] hover:shadow-[var(--shadow-glow),var(--shadow-card)] h-full flex flex-col justify-between">
        {/* Media Header */}
        <div className="relative w-full overflow-hidden bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
          <span className="absolute top-4 left-4 px-4 py-1.5 bg-[rgba(139,92,246,0.9)] backdrop-blur-[10px] rounded-lg text-xs font-semibold text-white z-20 shadow-lg">
            {project.roleBadge}
          </span>

          <div className="relative w-full h-[280px] bg-[#080c14] flex items-center justify-center p-3 overflow-hidden">
            {/* Ambient Blurred Background Image */}
            <img
              src={coverImage}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover opacity-30 blur-xl scale-110 pointer-events-none"
            />
            {/* Full Uncropped Main Image */}
            <img
              src={coverImage}
              alt={project.title}
              className="relative z-10 max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-500 hover:scale-105 rounded-lg drop-shadow-md"
              loading="lazy"
            />
          </div>
        </div>

        <div className="p-8 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-[1.7rem] font-bold leading-tight">{project.title}</h3>
              <span className="px-4 py-1.5 bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.3)] rounded-full text-xs text-[var(--accent-primary)] font-semibold font-mono whitespace-nowrap">
                {project.category}
              </span>
            </div>

            <p className="text-[var(--text-secondary)] text-[1.05rem] leading-[1.8] mb-6">
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
          </div>

          <div className="flex gap-4 flex-wrap pt-4 border-t border-[var(--border-color)]">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white no-underline rounded-xl font-semibold text-[0.95rem] transition-all duration-300 border-none cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(0,212,255,0.4)] inline-flex items-center gap-2"
              >
                View on GitHub ↗
              </a>
            )}
          </div>
        </div>
      </article>
    </Card3DEffect>
  );
}
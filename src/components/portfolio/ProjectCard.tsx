'use client';

import { useState } from 'react';
import type { Project } from '@/data/portfolio-data';
import { useVideoStore } from '@/hooks/useVideoStore';
import { useProjectStore } from '@/hooks/useProjectStore';

export default function ProjectCard({ project }: { project: Project }) {
  const { getVideosByProject } = useVideoStore();
  const { getProjectImage } = useProjectStore();
  const projectVideos = getVideosByProject(project.id);
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');

  const coverImage = getProjectImage(project);

  return (
    <article className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden transition-all duration-400 shadow-[var(--shadow-card)] hover:-translate-y-1 hover:border-[var(--accent-primary)] hover:shadow-[var(--shadow-glow),var(--shadow-card)]">
      {/* Media Header (Image or MP4 Video) */}
      <div className="relative w-full overflow-hidden bg-[var(--bg-secondary)]">
        {projectVideos.length > 0 && (
          <div className="absolute top-4 right-4 z-20 flex gap-2 bg-[rgba(0,0,0,0.7)] backdrop-blur-md p-1 rounded-lg border border-[var(--border-color)]">
            <button
              onClick={() => setActiveTab('image')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeTab === 'image'
                  ? 'bg-[var(--accent-primary)] text-white'
                  : 'text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              📷 Cover Image
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeTab === 'video'
                  ? 'bg-[var(--accent-primary)] text-white'
                  : 'text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              🎥 MP4 Video ({projectVideos.length})
            </button>
          </div>
        )}

        <span className="absolute top-4 left-4 px-4 py-1.5 bg-[rgba(139,92,246,0.9)] backdrop-blur-[10px] rounded-lg text-xs font-semibold text-white z-10">
          {project.roleBadge}
        </span>

        {activeTab === 'video' && projectVideos.length > 0 ? (
          <div className="p-4 bg-black">
            <video
              src={projectVideos[0].url}
              controls
              preload="metadata"
              className="w-full h-[350px] object-contain rounded-lg"
            />
            <div className="mt-3 p-3 bg-[rgba(255,255,255,0.05)] rounded-lg text-xs text-[var(--text-secondary)]">
              <strong className="text-[var(--accent-primary)] block text-sm mb-1">
                {projectVideos[0].title}
              </strong>
              {projectVideos[0].description}
            </div>
          </div>
        ) : (
          <div className="h-[350px]">
            <img
              src={coverImage}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
          </div>
        )}
      </div>

      <div className="p-8">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-[1.8rem] font-bold leading-tight">{project.title}</h3>
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
          {projectVideos.length > 0 && activeTab !== 'video' && (
            <button
              onClick={() => setActiveTab('video')}
              className="px-7 py-3 bg-[rgba(0,212,255,0.1)] text-[var(--accent-primary)] border border-[var(--accent-primary)] no-underline rounded-lg font-semibold text-[0.95rem] transition-all duration-300 cursor-pointer hover:bg-[var(--accent-primary)] hover:text-white inline-flex items-center gap-2"
            >
              ▶️ Play MP4 Demo Video
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
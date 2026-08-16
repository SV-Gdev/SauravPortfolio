'use client';

import { useVideoStore } from '@/hooks/useVideoStore';

export default function GameplayVideosSection() {
  const { videos, isLoading } = useVideoStore();

  const renderVideoPlayer = (url: string) => {
    // Helper to check if URL is YouTube, Vimeo, or Google Drive preview
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let embedUrl = url;
      if (url.includes('watch?v=')) {
        embedUrl = url.replace('watch?v=', 'embed/');
      } else if (url.includes('youtu.be/')) {
        embedUrl = url.replace('youtu.be/', 'www.youtube.com/embed/');
      }
      return (
        <iframe
          src={embedUrl}
          className="w-full aspect-video rounded-xl border border-[var(--border-color)]"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    if (url.includes('drive.google.com')) {
      let embedUrl = url.replace(/\/view.*$/, '/preview');
      return (
        <iframe
          src={embedUrl}
          className="w-full aspect-video rounded-xl border border-[var(--border-color)]"
          allow="autoplay"
        />
      );
    }

    // Default HTML5 video player for local files or direct MP4/WebM URLs
    return (
      <video
        src={url}
        controls
        preload="metadata"
        className="w-full aspect-video rounded-xl border border-[var(--border-color)] bg-black object-cover"
      >
        Your browser does not support playing this video.
      </video>
    );
  };

  return (
    <section id="videos" className="py-16 max-w-[1200px] mx-auto px-4 sm:px-8">
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-[2.5rem] font-extrabold tracking-tight text-white mb-2">
          Gameplay Videos
        </h2>
        <p className="text-[var(--text-secondary)] text-[1.1rem]">
          Watch gameplay footage and walkthroughs of my projects
        </p>
      </div>

      {/* Loading state or Empty State */}
      {isLoading ? (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-16 text-center min-h-[360px] flex items-center justify-center">
          <div className="text-[var(--text-secondary)] font-mono animate-pulse">
            Loading video showcase...
          </div>
        </div>
      ) : videos.length === 0 ? (
        /* Empty State Card - Exact Match to Screenshot */
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-12 sm:p-20 text-center min-h-[380px] flex flex-col items-center justify-center">
          {/* Gray Play Icon */}
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] mb-6 text-slate-500">
            <svg className="w-8 h-8 fill-current translate-x-0.5" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>

          <h3 className="text-xl font-bold text-white mb-3 tracking-wide">
            No videos yet
          </h3>

          <p className="text-[var(--text-secondary)] text-sm max-w-md mx-auto leading-relaxed">
            Gameplay videos will appear here once uploaded via the admin panel.
          </p>
          <p className="text-[var(--text-secondary)] text-sm max-w-md mx-auto leading-relaxed mt-1">
            Stay tuned for project walkthroughs and demos!
          </p>
        </div>
      ) : (
        /* Populated Video Grid (Read-Only) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {videos.map((vid) => (
            <div
              key={vid.id}
              className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:border-[var(--accent-primary)] hover:shadow-[0_8px_30px_rgba(0,212,255,0.12)] flex flex-col justify-between"
            >
              <div>
                <div className="mb-4 overflow-hidden rounded-xl bg-black">
                  {renderVideoPlayer(vid.videoUrl)}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.3)] rounded-full text-xs font-bold text-[var(--accent-primary)] font-mono">
                    🎮 {vid.project}
                  </span>
                  {vid.createdAt && (
                    <span className="text-xs text-[var(--text-secondary)] font-mono ml-auto">
                      {new Date(vid.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2 leading-snug">
                  {vid.title}
                </h3>

                {vid.description && (
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4">
                    {vid.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useVideoStore, VideoItem } from '@/hooks/useVideoStore';

const DRIVE_FOLDER_URL =
  'https://drive.google.com/drive/folders/1FvEtW6gsmQtGIw7mAMD5ShEiSraZ0pUO?usp=sharing';

export default function VideoShowcaseSection() {
  const { videos, isLoading } = useVideoStore();
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  useEffect(() => {
    if (videos.length > 0 && !selectedVideo) {
      setSelectedVideo(videos[0]);
    }
  }, [videos, selectedVideo]);

  // Helper to detect if a URL is a Google Drive URL or embed
  const getEmbedUrl = (url: string) => {
    if (url.includes('drive.google.com')) {
      if (url.includes('/preview')) return url;
      // Convert view url to preview url
      const match = url.match(/\/file\/d\/([^\/]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
    }
    return url;
  };

  if (isLoading) {
    return (
      <section id="video-showcase" className="max-w-[1200px] mx-auto my-12 px-8 py-12 text-center text-[var(--text-secondary)]">
        <p>Loading video showcase...</p>
      </section>
    );
  }

  if (videos.length === 0) {
    return (
      <section
        id="video-showcase"
        className="max-w-[1200px] mx-auto my-16 px-8 sm:px-12 py-12 bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)] text-center text-[var(--text-primary)]"
      >
        <span className="text-4xl mb-4 block">🎬</span>
        <h2 className="text-3xl font-extrabold mb-3">Gameplay Video Showcase</h2>
        <p className="text-[var(--text-secondary)] max-w-xl mx-auto mb-6">
          No gameplay videos uploaded yet. Use the Owner Management Studio below to upload MP4 clips or link Google Drive videos!
        </p>
        <a
          href={DRIVE_FOLDER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[rgba(0,212,255,0.1)] text-[var(--accent-primary)] border border-[var(--accent-primary)] rounded-xl font-bold text-sm hover:bg-[var(--accent-primary)] hover:text-white transition-all"
        >
          ☁️ Open Google Drive Video Cloud Storage
        </a>
      </section>
    );
  }

  const currentVideo = selectedVideo || videos[0];
  const isDriveEmbed = currentVideo.url.includes('drive.google.com');
  const embedUrl = getEmbedUrl(currentVideo.url);

  return (
    <section
      id="video-showcase"
      className="max-w-[1200px] mx-auto my-16 px-6 sm:px-12 py-12 bg-gradient-to-b from-[var(--bg-secondary)] via-[var(--bg-card)] to-[var(--bg-primary)] rounded-3xl border-2 border-[var(--accent-primary)]/40 shadow-[0_0_40px_rgba(0,212,255,0.15)] text-[var(--text-primary)]"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap border-b border-[var(--border-color)] pb-6">
        <div className="flex items-center gap-4">
          <span className="text-4xl p-3.5 bg-[rgba(0,212,255,0.15)] rounded-2xl border border-[rgba(0,212,255,0.4)] shadow-[0_0_15px_rgba(0,212,255,0.2)]">
            🎬
          </span>
          <div>
            <span className="text-xs font-mono tracking-widest text-[var(--accent-primary)] uppercase font-bold">
              Featured Gameplay Demos
            </span>
            <h2 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
              Gameplay Video Showcase
            </h2>
          </div>
        </div>

        {/* Google Drive Storage Link */}
        <a
          href={DRIVE_FOLDER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 bg-[rgba(0,212,255,0.1)] text-[var(--accent-primary)] border border-[rgba(0,212,255,0.4)] rounded-xl font-bold text-xs hover:bg-[var(--accent-primary)] hover:text-white transition-all shadow-md"
        >
          ☁️ Google Drive Storage Folder ↗
        </a>
      </div>

      {/* Main Showcase Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Main Video Player & Description */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative overflow-hidden rounded-2xl border-2 border-[var(--accent-primary)]/50 bg-black shadow-[0_0_25px_rgba(0,0,0,0.8)]">
            {isDriveEmbed ? (
              <iframe
                src={embedUrl}
                className="w-full h-[400px] sm:h-[480px] border-0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <video
                key={currentVideo.id}
                src={currentVideo.url}
                controls
                autoPlay={false}
                controlsList="nodownload"
                className="w-full h-[400px] sm:h-[480px] object-contain bg-black"
              />
            )}

            <div className="absolute top-4 left-4 px-4 py-1.5 bg-[rgba(0,0,0,0.8)] backdrop-blur-md border border-[var(--accent-primary)] rounded-full text-xs font-bold text-[var(--accent-primary)]">
              ▶ Playing: {currentVideo.title}
            </div>
          </div>

          {/* Video Description Box */}
          <div className="p-6 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-xl font-extrabold text-[var(--text-primary)]">
                {currentVideo.title}
              </h3>
              <span className="text-xs font-mono text-[var(--text-secondary)] bg-[rgba(255,255,255,0.05)] px-3 py-1 rounded-md border border-[var(--border-color)]">
                Uploaded: {new Date(currentVideo.createdAt).toLocaleDateString()}
              </span>
            </div>

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line font-normal">
              {currentVideo.description}
            </p>
          </div>
        </div>

        {/* Right 1 Col: Video Playlist / Selector */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-[var(--accent-primary)] font-mono uppercase tracking-wider">
            Uploaded Videos Playlist ({videos.length})
          </h4>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {videos.map((vid) => {
              const isSelected = selectedVideo?.id === vid.id;
              return (
                <div
                  key={vid.id}
                  onClick={() => setSelectedVideo(vid)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? 'bg-[rgba(0,212,255,0.15)] border-[var(--accent-primary)] shadow-[0_0_15px_rgba(0,212,255,0.2)]'
                      : 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-[var(--accent-primary)]/50 hover:bg-[rgba(0,212,255,0.05)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold font-mono text-[var(--accent-primary)]">
                      {isSelected ? '▶ NOW PLAYING' : '🎥 MP4 DEMO'}
                    </span>
                    {vid.fileSize && (
                      <span className="text-[10px] text-[var(--text-secondary)]">
                        {(vid.fileSize / (1024 * 1024)).toFixed(1)} MB
                      </span>
                    )}
                  </div>

                  <h5 className="font-extrabold text-base text-[var(--text-primary)] mb-1 line-clamp-1">
                    {vid.title}
                  </h5>

                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-snug">
                    {vid.description}
                  </p>
                </div>
              );
            })}
          </div>

          <a
            href={DRIVE_FOLDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center py-3 px-4 bg-[rgba(255,255,255,0.03)] border border-[var(--border-color)] rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-primary)] transition-all"
          >
            ☁️ Access Google Drive Storage Directory
          </a>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { useVideoStore } from '@/hooks/useVideoStore';

const projectOptions = [
  { value: 'shooter', label: 'Shooter Game (Flagship)' },
  { value: 'knuckle2', label: 'Knuckle2 (Group Project)' },
  { value: 'mario', label: 'Mario Recreation' },
  { value: 'orion', label: 'Orion Healthcare Backend' },
];

export default function AdminModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Video Form States
  const [selectedProject, setSelectedProject] = useState('shooter');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState('1');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { videos, uploadVideoFile, deleteVideo } = useVideoStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) onClose();
  };

  const handleLogin = () => {
    if (username === 'admin' && password === 'password') {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        setUploadMessage({ type: 'error', text: 'Please select a valid MP4 or video file (.mp4, .webm).' });
        return;
      }
      setSelectedFile(file);
      if (!videoTitle) {
        // Auto set title from file name
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setVideoTitle(cleanName);
      }
      setUploadMessage(null);
    }
  };

  const handleAddVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setUploadMessage({ type: 'error', text: 'Please select an MP4 video file to upload.' });
      return;
    }

    if (!videoDescription.trim()) {
      setUploadMessage({ type: 'error', text: 'Please enter a description for the video.' });
      return;
    }

    setIsUploading(true);
    setUploadMessage(null);

    try {
      await uploadVideoFile(selectedFile, {
        projectId: selectedProject,
        title: videoTitle.trim() || selectedFile.name,
        description: videoDescription.trim(),
        displayOrder: parseInt(displayOrder || '1', 10),
      });

      setUploadMessage({
        type: 'success',
        text: `🎉 Video "${selectedFile.name}" and description added successfully!`,
      });

      // Reset form
      setSelectedFile(null);
      setVideoTitle('');
      setVideoDescription('');
      setDisplayOrder('1');
      const fileInput = document.getElementById('videoFileInput') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err: any) {
      setUploadMessage({
        type: 'error',
        text: err?.message || 'Failed to add video. Please try again.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleBuildUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(
        `Build file "${file.name}" selected for upload.\n\nIn production, this would extract WebGL builds for browser play.`
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[9999] bg-[rgba(0,0,0,0.9)] backdrop-blur-[10px] overflow-y-auto"
    >
      <div className="max-w-[1000px] my-12 mx-auto p-8 sm:p-12 bg-[var(--bg-secondary)] rounded-[20px] border border-[var(--border-color)] text-[var(--text-primary)]">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pb-6 border-b-2 border-[var(--border-color)]">
          <h2 className="text-2xl font-extrabold text-[var(--accent-secondary)]">
            🔒 Admin Dashboard — Video & Build Manager
          </h2>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-[var(--text-secondary)] text-3xl cursor-pointer transition-colors duration-300 hover:text-[var(--text-primary)] leading-none"
          >
            &times;
          </button>
        </div>

        {/* Login Form */}
        {!isAuthenticated ? (
          <div className="max-w-[450px] my-12 mx-auto p-8 sm:p-12 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)]">
            <h3 className="text-center mb-2 text-xl font-bold text-[var(--accent-primary)]">
              Administrator Login
            </h3>
            <p className="text-center text-[var(--text-secondary)] text-sm mb-8">
              Default login: username <code className="text-[var(--accent-primary)]">admin</code> / password <code className="text-[var(--accent-primary)]">password</code>
            </p>
            <div className="mb-6">
              <label className="block mb-2 text-[var(--text-secondary)] font-medium text-[0.95rem]">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full px-5 py-3.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-base focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-[var(--text-secondary)] font-medium text-[0.95rem]">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-5 py-3.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-base focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full px-10 py-4 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white rounded-xl font-semibold text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,212,255,0.4)] cursor-pointer"
            >
              Login to Dashboard
            </button>
            {loginError && (
              <p className="text-[#ff4444] text-center mt-4 text-sm font-medium">
                Invalid credentials. Use admin / password
              </p>
            )}
          </div>
        ) : (
          <>
            {/* Video Management Section */}
            <div className="mb-12 p-8 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)]">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🎥</span>
                <div>
                  <h3 className="text-[1.5rem] font-bold text-[var(--accent-primary)]">
                    Add & Manage MP4 Videos
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Upload MP4 gameplay footage, attach descriptions, and feature them on your site
                  </p>
                </div>
              </div>

              <form onSubmit={handleAddVideoSubmit} className="space-y-6">
                {/* Select Project */}
                <div>
                  <label className="block mb-2 text-[var(--text-secondary)] font-medium text-[0.95rem]">
                    Target Project *
                  </label>
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full px-5 py-3.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-base focus:outline-none focus:border-[var(--accent-primary)]"
                  >
                    {projectOptions.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* MP4 File Selector & Dropzone */}
                <div>
                  <label className="block mb-2 text-[var(--text-secondary)] font-medium text-[0.95rem]">
                    MP4 Video File *
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-xl py-8 px-6 text-center cursor-pointer transition-all duration-300 ${
                      selectedFile
                        ? 'border-[var(--accent-primary)] bg-[rgba(0,212,255,0.08)]'
                        : 'border-[var(--border-color)] hover:border-[var(--accent-primary)] hover:bg-[rgba(0,212,255,0.03)]'
                    }`}
                    onClick={() => document.getElementById('videoFileInput')?.click()}
                  >
                    {selectedFile ? (
                      <div className="space-y-2">
                        <p className="text-lg font-bold text-[var(--accent-primary)]">
                          🎬 {selectedFile.name}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Type: {selectedFile.type || 'MP4 Video'}
                        </p>
                        <span className="inline-block px-3 py-1 bg-[rgba(0,212,255,0.2)] text-[var(--accent-primary)] text-xs rounded-full">
                          Click to change file
                        </span>
                      </div>
                    ) : (
                      <div>
                        <p className="text-[1.2rem] text-[var(--text-secondary)] mb-2 font-semibold">
                          📁 Click or drag MP4 video file here
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          Supports MP4, WebM • Fast upload & local streaming
                        </p>
                      </div>
                    )}
                    <input
                      id="videoFileInput"
                      type="file"
                      accept="video/mp4,video/webm,video/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                {/* Video Title */}
                <div>
                  <label className="block mb-2 text-[var(--text-secondary)] font-medium text-[0.95rem]">
                    Video Title
                  </label>
                  <input
                    type="text"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="e.g., Enemy AI Behavior Tree & Pathfinding Showcase"
                    className="w-full px-5 py-3.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-base focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                {/* Video Description */}
                <div>
                  <label className="block mb-2 text-[var(--text-secondary)] font-medium text-[0.95rem]">
                    Video Description (displays with player on public site) *
                  </label>
                  <textarea
                    rows={4}
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
                    placeholder="Describe what happens in this MP4 gameplay video, features demonstrated, technical mechanics shown, timestamps, etc..."
                    className="w-full px-5 py-3.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-base focus:outline-none focus:border-[var(--accent-primary)] resize-y"
                  />
                </div>

                {/* Display Order */}
                <div>
                  <label className="block mb-2 text-[var(--text-secondary)] font-medium text-[0.95rem]">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    min={1}
                    className="w-full px-5 py-3.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-base focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                {/* Feedback Banners */}
                {uploadMessage && (
                  <div
                    className={`p-4 rounded-lg text-sm font-medium ${
                      uploadMessage.type === 'success'
                        ? 'bg-[rgba(16,185,129,0.15)] text-[#10b981] border border-[#10b981]'
                        : 'bg-[rgba(239,68,68,0.15)] text-[#ef4444] border border-[#ef4444]'
                    }`}
                  >
                    {uploadMessage.text}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isUploading}
                  className={`w-full py-4 px-10 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white rounded-xl font-bold text-base transition-all duration-300 ${
                    isUploading ? 'opacity-50 cursor-wait' : 'hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,212,255,0.4)] cursor-pointer'
                  }`}
                >
                  {isUploading ? '⏳ Uploading Video & Description...' : '➕ Add Video with Description'}
                </button>
              </form>

              {/* Uploaded Videos List */}
              <div className="mt-12 pt-8 border-t border-[var(--border-color)]">
                <h4 className="text-[1.2rem] font-bold mb-6 text-[var(--text-primary)] flex items-center justify-between">
                  <span>📹 Uploaded MP4 Videos ({videos.length})</span>
                  <span className="text-xs text-[var(--text-secondary)] font-normal">
                    Real-time synced
                  </span>
                </h4>

                {videos.length === 0 ? (
                  <div className="bg-[rgba(0,0,0,0.3)] p-8 rounded-lg text-center text-[var(--text-secondary)] border border-[var(--border-color)]">
                    <p className="text-base font-semibold">No videos added yet</p>
                    <p className="text-sm mt-1">
                      Upload an MP4 file with description above to showcase gameplay videos!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {videos.map((vid) => (
                      <div
                        key={vid.id}
                        className="bg-[var(--bg-primary)] p-6 rounded-xl border border-[var(--border-color)] flex flex-col md:flex-row gap-6 items-start justify-between"
                      >
                        {/* Video HTML5 Preview */}
                        <div className="w-full md:w-64 rounded-lg overflow-hidden bg-black border border-[var(--border-color)]">
                          <video
                            src={vid.url}
                            controls
                            preload="metadata"
                            className="w-full h-36 object-cover"
                          />
                        </div>

                        {/* Metadata & Description */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="px-3 py-1 bg-[rgba(0,212,255,0.15)] text-[var(--accent-primary)] font-mono text-xs rounded-md font-semibold">
                              {projectOptions.find((p) => p.value === vid.projectId)?.label || vid.projectId}
                            </span>
                            <span className="text-xs text-[var(--text-secondary)]">
                              Order: {vid.displayOrder}
                            </span>
                            {vid.fileSize && (
                              <span className="text-xs text-[var(--text-secondary)]">
                                {(vid.fileSize / (1024 * 1024)).toFixed(1)} MB
                              </span>
                            )}
                          </div>

                          <h5 className="text-lg font-bold text-[var(--text-primary)]">
                            {vid.title}
                          </h5>

                          <div className="bg-[rgba(0,0,0,0.2)] p-3 rounded-lg border border-[rgba(255,255,255,0.05)]">
                            <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
                              {vid.description}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div>
                          <button
                            onClick={() => {
                              if (confirm(`Delete video "${vid.title}"?`)) {
                                deleteVideo(vid.id);
                              }
                            }}
                            className="px-4 py-2 bg-[rgba(239,68,68,0.2)] hover:bg-[rgba(239,68,68,0.4)] text-[#ef4444] border border-[#ef4444] rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Game Build Management */}
            <div className="mb-12 p-8 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)]">
              <h3 className="text-[1.5rem] font-bold mb-6 text-[var(--accent-primary)]">
                🎮 Game Build Management
              </h3>
              <div className="mb-6">
                <label className="block mb-2 text-[var(--text-secondary)] font-medium text-[0.95rem]">
                  Select Project
                </label>
                <select className="w-full px-5 py-3.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-base focus:outline-none focus:border-[var(--accent-primary)]">
                  {projectOptions.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <div
                className="border-2 border-dashed border-[var(--border-color)] rounded-xl py-8 text-center cursor-pointer transition-all duration-300 mb-6 hover:border-[var(--accent-primary)] hover:bg-[rgba(0,212,255,0.03)]"
                onClick={() => document.getElementById('buildFileInput')?.click()}
              >
                <p className="text-[1.2rem] text-[var(--text-secondary)] mb-2">
                  📦 Click to upload build folder (ZIP/EXE)
                </p>
                <input
                  id="buildFileInput"
                  type="file"
                  accept=".zip,.exe"
                  className="hidden"
                  onChange={handleBuildUpload}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

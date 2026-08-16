'use client';

import { useState, useEffect, useRef } from 'react';
import { useProjectStore } from '@/hooks/useProjectStore';
import { useVideoStore } from '@/hooks/useVideoStore';

const projectOptions = [
  { value: 'shooter', label: 'Shooter Game (Flagship)' },
  { value: 'knuckle2', label: 'Knuckle2 (Group Project)' },
  { value: 'mario', label: 'Mario Recreation' },
  { value: 'orion', label: 'Orion Healthcare Backend' },
  { value: 'general', label: 'General Gameplay Showcase' },
];

export default function AdminModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Cover Image Upload State
  const [selectedImageProject, setSelectedImageProject] = useState('shooter');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [imageMessage, setImageMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Video Upload State
  const [videoTitle, setVideoTitle] = useState('');
  const [selectedVideoProject, setSelectedVideoProject] = useState('Shooter Game');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoSourceType, setVideoSourceType] = useState<'file' | 'url'>('file');
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [videoMessage, setVideoMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { updateProjectImage } = useProjectStore();
  const { videos, addVideoWithFile, deleteVideo } = useVideoStore();

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

  const handleLogin = async () => {
    const u = username.trim().toLowerCase();
    const p = password.trim();

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setLoginError(false);
        return;
      }
    } catch (e) {
      console.warn('API login check failed, using fallback:', e);
    }

    // Client-side fallback check (case-insensitive for MITHILESH, saurav, admin)
    if (
      (u === 'mithilesh' || u === 'saurav' || u === 'admin') &&
      (p === 'SAURAVvalo@1234' || p === 'password' || p === 'admin')
    ) {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(file.type.toLowerCase()) && !file.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
        setImageMessage({ type: 'error', text: 'Please select a valid JPG or PNG image file (.jpg, .png).' });
        return;
      }
      setSelectedImageFile(file);
      setImageMessage(null);
    }
  };

  const handleUpdateImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedImageFile) {
      setImageMessage({ type: 'error', text: 'Please select a JPG or PNG image file.' });
      return;
    }

    setIsImageUploading(true);
    setImageMessage(null);

    try {
      await updateProjectImage(selectedImageProject, selectedImageFile);
      const projLabel = projectOptions.find((p) => p.value === selectedImageProject)?.label;

      setImageMessage({
        type: 'success',
        text: `🖼️ Cover image for ${projLabel} updated successfully!`,
      });

      setSelectedImageFile(null);
      const fileInput = document.getElementById('projectImageFileInput') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err: any) {
      setImageMessage({
        type: 'error',
        text: err?.message || 'Failed to update cover image.',
      });
    } finally {
      setIsImageUploading(false);
    }
  };

  // Video Upload Handlers
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedVideoFile(file);
      setVideoMessage(null);
    }
  };

  const handleAddVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoTitle.trim()) {
      setVideoMessage({ type: 'error', text: 'Please provide a title for the video.' });
      return;
    }

    if (videoSourceType === 'file' && !selectedVideoFile) {
      setVideoMessage({ type: 'error', text: 'Please select an MP4 or WebM video file to upload.' });
      return;
    }

    if (videoSourceType === 'url' && !videoUrlInput.trim()) {
      setVideoMessage({ type: 'error', text: 'Please enter a valid video URL (e.g., YouTube or Google Drive link).' });
      return;
    }

    setIsVideoUploading(true);
    setVideoMessage(null);

    try {
      await addVideoWithFile(
        videoTitle.trim(),
        selectedVideoProject,
        videoDescription.trim(),
        videoSourceType === 'file' ? selectedVideoFile : null,
        videoSourceType === 'url' ? videoUrlInput.trim() : undefined
      );

      setVideoMessage({
        type: 'success',
        text: `🎥 Gameplay video "${videoTitle}" added successfully!`,
      });

      // Reset form
      setVideoTitle('');
      setVideoDescription('');
      setSelectedVideoFile(null);
      setVideoUrlInput('');
      const fileInput = document.getElementById('gameplayVideoFileInput') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err: any) {
      setVideoMessage({
        type: 'error',
        text: err?.message || 'Failed to upload video.',
      });
    } finally {
      setIsVideoUploading(false);
    }
  };

  const handleDeleteVideoClick = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await deleteVideo(id);
      setVideoMessage({ type: 'success', text: `🗑️ Video "${title}" deleted successfully.` });
    } catch (err: any) {
      setVideoMessage({ type: 'error', text: err?.message || 'Failed to delete video.' });
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
            🔒 Admin Dashboard — Media & Build Manager
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
            <p className="text-center text-[var(--text-secondary)] text-sm mb-6">
              Enter your admin credentials below to access management tools.
            </p>

            <div className="mb-6">
              <label className="block mb-2 text-[var(--text-secondary)] font-medium text-[0.95rem]">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. MITHILESH, saurav, or admin"
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
                placeholder="Enter password"
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
              <div className="mt-4 p-3 bg-[rgba(239,68,68,0.15)] border border-[#ef4444] rounded-lg text-[#ef4444] text-center text-xs">
                Invalid credentials. Check username & password in your <code>.env</code> file.
              </div>
            )}
          </div>
        ) : (
          <>
            {/* 📹 GAMEPLAY VIDEO MANAGER SECTION */}
            <div className="mb-12 p-8 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)]">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">📹</span>
                <div>
                  <h3 className="text-[1.5rem] font-bold text-[var(--accent-primary)]">
                    Gameplay Video Manager
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Upload MP4/WebM video files or embed YouTube/Google Drive links to show in the Gameplay Videos section
                  </p>
                </div>
              </div>

              <form onSubmit={handleAddVideoSubmit} className="space-y-6">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-[var(--text-primary)]">
                    Video Title *
                  </label>
                  <input
                    type="text"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="e.g. Shooter Game AI Combat Walkthrough"
                    className="w-full px-5 py-3.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent-primary)] font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-[var(--text-primary)]">
                      Associated Project
                    </label>
                    <select
                      value={selectedVideoProject}
                      onChange={(e) => setSelectedVideoProject(e.target.value)}
                      className="w-full px-5 py-3.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent-primary)] font-medium"
                    >
                      <option value="Shooter Game">Shooter Game</option>
                      <option value="Knuckle2">Knuckle2</option>
                      <option value="Mario Recreation">Mario Recreation</option>
                      <option value="Orion Backend">Orion Backend</option>
                      <option value="Gameplay Showcase">General Gameplay</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-[var(--text-primary)]">
                      Video Source Type
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setVideoSourceType('file')}
                        className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
                          videoSourceType === 'file'
                            ? 'bg-[var(--accent-primary)] text-black'
                            : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-color)]'
                        }`}
                      >
                        📁 File Upload (.mp4)
                      </button>
                      <button
                        type="button"
                        onClick={() => setVideoSourceType('url')}
                        className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
                          videoSourceType === 'url'
                            ? 'bg-[var(--accent-primary)] text-black'
                            : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-color)]'
                        }`}
                      >
                        🔗 URL Link
                      </button>
                    </div>
                  </div>
                </div>

                {videoSourceType === 'file' ? (
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-[var(--text-primary)]">
                      Select Video File (MP4, WebM) *
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-2xl py-8 px-6 text-center cursor-pointer transition-all duration-300 ${
                        selectedVideoFile
                          ? 'border-[var(--accent-primary)] bg-[rgba(0,212,255,0.08)]'
                          : 'border-[var(--border-color)] hover:border-[var(--accent-primary)] hover:bg-[rgba(0,212,255,0.03)]'
                      }`}
                      onClick={() => document.getElementById('gameplayVideoFileInput')?.click()}
                    >
                      {selectedVideoFile ? (
                        <div className="space-y-2">
                          <p className="text-lg font-bold text-[var(--accent-primary)]">
                            🎥 Selected Video: {selectedVideoFile.name}
                          </p>
                          <p className="text-xs text-[var(--text-secondary)]">
                            Size: {(selectedVideoFile.size / (1024 * 1024)).toFixed(2)} MB • Format: {selectedVideoFile.type || 'MP4'}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-lg font-semibold text-[var(--text-primary)] mb-1">
                            🎥 Click or Drag Gameplay Video File Here
                          </p>
                          <p className="text-xs text-[var(--text-secondary)]">
                            Supports .mp4, .webm, .mov • Upload high quality gameplay clips
                          </p>
                        </div>
                      )}
                      <input
                        id="gameplayVideoFileInput"
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        className="hidden"
                        onChange={handleVideoFileChange}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-[var(--text-primary)]">
                      Video URL Link (YouTube / Google Drive / MP4 URL) *
                    </label>
                    <input
                      type="text"
                      value={videoUrlInput}
                      onChange={(e) => setVideoUrlInput(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=... or Google Drive link"
                      className="w-full px-5 py-3.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent-primary)] font-medium font-mono"
                    />
                  </div>
                )}

                <div>
                  <label className="block mb-2 text-sm font-semibold text-[var(--text-primary)]">
                    Description (Optional)
                  </label>
                  <textarea
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
                    rows={3}
                    placeholder="Brief description of the gameplay video mechanics or features demonstrated..."
                    className="w-full px-5 py-3.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent-primary)] font-medium"
                  />
                </div>

                {videoMessage && (
                  <div
                    className={`p-4 rounded-xl text-sm font-medium ${
                      videoMessage.type === 'success'
                        ? 'bg-[rgba(16,185,129,0.15)] text-[#10b981] border border-[#10b981]'
                        : 'bg-[rgba(239,68,68,0.15)] text-[#ef4444] border border-[#ef4444]'
                    }`}
                  >
                    {videoMessage.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isVideoUploading}
                  className={`w-full py-4 px-10 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white rounded-xl font-bold text-base transition-all ${
                    isVideoUploading ? 'opacity-50 cursor-wait' : 'hover:-translate-y-0.5 cursor-pointer'
                  }`}
                >
                  {isVideoUploading ? '⏳ Uploading Video...' : '🎥 Add Gameplay Video to Showcase'}
                </button>
              </form>

              {/* List of uploaded videos for Admin */}
              <div className="mt-10 pt-8 border-t border-[var(--border-color)]">
                <h4 className="text-lg font-bold text-white mb-4">
                  Existing Gameplay Videos ({videos.length})
                </h4>
                {videos.length === 0 ? (
                  <p className="text-xs text-[var(--text-secondary)] italic">
                    No videos uploaded yet. Add your first video above!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {videos.map((v) => (
                      <div
                        key={v.id}
                        className="flex items-center justify-between p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl"
                      >
                        <div className="truncate pr-4">
                          <span className="font-bold text-white text-sm block truncate">{v.title}</span>
                          <span className="text-xs font-mono text-[var(--accent-primary)]">
                            [{v.project}] • {v.isLocal ? 'File Upload' : 'External Link'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteVideoClick(v.id, v.title)}
                          className="px-4 py-2 bg-[rgba(239,68,68,0.15)] hover:bg-[#ef4444] text-[#ef4444] hover:text-white border border-[#ef4444] rounded-lg text-xs font-bold transition-all cursor-pointer flex-shrink-0"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Cover Image Manager */}
            <div className="mb-12 p-8 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)]">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🖼️</span>
                <div>
                  <h3 className="text-[1.5rem] font-bold text-[var(--accent-primary)]">
                    Project Cover Image Manager
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Upload high quality JPG/PNG cover images for your portfolio projects
                  </p>
                </div>
              </div>

              <form onSubmit={handleUpdateImageSubmit} className="space-y-6">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-[var(--text-primary)]">
                    Select Project
                  </label>
                  <select
                    value={selectedImageProject}
                    onChange={(e) => setSelectedImageProject(e.target.value)}
                    className="w-full px-5 py-3.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent-primary)] font-medium"
                  >
                    {projectOptions.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold text-[var(--text-primary)]">
                    Project Cover Image (JPG or PNG) *
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-2xl py-8 px-6 text-center cursor-pointer transition-all duration-300 ${
                      selectedImageFile
                        ? 'border-[var(--accent-primary)] bg-[rgba(0,212,255,0.08)]'
                        : 'border-[var(--border-color)] hover:border-[var(--accent-primary)] hover:bg-[rgba(0,212,255,0.03)]'
                    }`}
                    onClick={() => document.getElementById('projectImageFileInput')?.click()}
                  >
                    {selectedImageFile ? (
                      <div className="space-y-2">
                        <p className="text-lg font-bold text-[var(--accent-primary)]">
                          🖼️ Selected Image: {selectedImageFile.name}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          Size: {(selectedImageFile.size / 1024).toFixed(1)} KB • Format: {selectedImageFile.type || 'JPG/PNG'}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-lg font-semibold text-[var(--text-primary)] mb-1">
                          🖼️ Click or Drag JPG or PNG Image File Here
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          Supports .jpg, .jpeg, .png, .webp • High resolution cover images
                        </p>
                      </div>
                    )}
                    <input
                      id="projectImageFileInput"
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/webp"
                      className="hidden"
                      onChange={handleImageFileChange}
                    />
                  </div>
                </div>

                {imageMessage && (
                  <div
                    className={`p-4 rounded-xl text-sm font-medium ${
                      imageMessage.type === 'success'
                        ? 'bg-[rgba(16,185,129,0.15)] text-[#10b981] border border-[#10b981]'
                        : 'bg-[rgba(239,68,68,0.15)] text-[#ef4444] border border-[#ef4444]'
                    }`}
                  >
                    {imageMessage.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isImageUploading}
                  className={`w-full py-4 px-10 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white rounded-xl font-bold text-base transition-all ${
                    isImageUploading ? 'opacity-50 cursor-wait' : 'hover:-translate-y-0.5 cursor-pointer'
                  }`}
                >
                  {isImageUploading ? '⏳ Updating Cover Image...' : '🖼️ Update Project Cover Image'}
                </button>
              </form>
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

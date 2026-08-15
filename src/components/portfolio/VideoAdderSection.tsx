'use client';

import { useState } from 'react';
import { useVideoStore } from '@/hooks/useVideoStore';
import { useProjectStore } from '@/hooks/useProjectStore';

const DRIVE_FOLDER_URL =
  'https://drive.google.com/drive/folders/1FvEtW6gsmQtGIw7mAMD5ShEiSraZ0pUO?usp=sharing';

const projectOptions = [
  { value: 'shooter', label: 'Shooter Game (Flagship Project)' },
  { value: 'knuckle2', label: 'Knuckle2 (Group Fighting Game)' },
  { value: 'mario', label: 'Mario Recreation (2D Platformer)' },
  { value: 'orion', label: 'Orion Healthcare Backend' },
];

export default function VideoAdderSection() {
  // Owner Access Lock state
  const [isOwnerUnlocked, setIsOwnerUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

  // Active Tab: Video Upload vs Cover Image Upload
  const [activeAdminTab, setActiveAdminTab] = useState<'video' | 'image'>('video');

  // Video Upload Source Mode: File MP4 vs Google Drive Link
  const [uploadSourceMode, setUploadSourceMode] = useState<'file' | 'drive'>('file');
  const [driveUrlInput, setDriveUrlInput] = useState('');

  // Video Form States
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [selectedVideoProject, setSelectedVideoProject] = useState('shooter');
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [videoMessage, setVideoMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Image Form States
  const [selectedImageProject, setSelectedImageProject] = useState('shooter');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [imageMessage, setImageMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { uploadVideoFile, addVideo } = useVideoStore();
  const { updateProjectImage } = useProjectStore();

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'password' || passwordInput === 'admin') {
      setIsOwnerUnlocked(true);
      setAuthError(false);
      setShowPasswordPrompt(false);
      setPasswordInput('');
    } else {
      setAuthError(true);
    }
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        setVideoMessage({ type: 'error', text: 'Please select a valid MP4 or video file (.mp4, .webm).' });
        return;
      }
      setSelectedVideoFile(file);
      if (!videoTitle) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setVideoTitle(cleanName);
      }
      setVideoMessage(null);
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

  const handleAddVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (uploadSourceMode === 'file' && !selectedVideoFile) {
      setVideoMessage({ type: 'error', text: 'Please select an MP4 video file.' });
      return;
    }

    if (uploadSourceMode === 'drive' && !driveUrlInput.trim()) {
      setVideoMessage({ type: 'error', text: 'Please paste a Google Drive video link.' });
      return;
    }

    if (!videoDescription.trim()) {
      setVideoMessage({ type: 'error', text: 'Please add a description for this video.' });
      return;
    }

    setIsVideoUploading(true);
    setVideoMessage(null);

    try {
      if (uploadSourceMode === 'file' && selectedVideoFile) {
        await uploadVideoFile(selectedVideoFile, {
          projectId: selectedVideoProject,
          title: videoTitle.trim() || selectedVideoFile.name,
          description: videoDescription.trim(),
          displayOrder: 1,
        });
      } else {
        // Direct Google Drive Link
        await addVideo({
          projectId: selectedVideoProject,
          title: videoTitle.trim() || 'Google Drive Video',
          description: videoDescription.trim(),
          url: driveUrlInput.trim(),
          fileName: 'Google Drive Video',
          displayOrder: 1,
        });
      }

      setVideoMessage({
        type: 'success',
        text: `🎉 Video and description added successfully to your portfolio showcase!`,
      });

      setSelectedVideoFile(null);
      setDriveUrlInput('');
      setVideoTitle('');
      setVideoDescription('');
      const fileInput = document.getElementById('directVideoFileInput') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err: any) {
      setVideoMessage({
        type: 'error',
        text: err?.message || 'Failed to add video. Please try again.',
      });
    } finally {
      setIsVideoUploading(false);
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

  return (
    <section
      id="add-video"
      className="max-w-[1200px] mx-auto my-16 px-8 sm:px-12 py-10 bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--bg-card)] rounded-3xl border-2 border-[var(--accent-primary)]/30 shadow-[0_0_30px_rgba(0,212,255,0.1)] text-[var(--text-primary)]"
    >
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6 pb-6 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-4">
          <span className="text-3xl p-3 bg-[rgba(0,212,255,0.1)] rounded-2xl border border-[rgba(0,212,255,0.3)]">
            🔐
          </span>
          <div>
            <span className="text-xs font-mono tracking-widest text-[var(--accent-primary)] uppercase font-semibold">
              Owner Management Studio
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
              Portfolio Media & Video Manager
            </h2>
          </div>
        </div>

        {/* Lock / Unlock Toggle Button */}
        <div>
          {isOwnerUnlocked ? (
            <button
              onClick={() => setIsOwnerUnlocked(false)}
              className="px-5 py-2.5 bg-[rgba(239,68,68,0.15)] text-[#ef4444] border border-[#ef4444] rounded-xl text-xs font-bold cursor-pointer hover:bg-[rgba(239,68,68,0.3)] transition-colors"
            >
              🔒 Lock Owner Controls
            </button>
          ) : (
            <button
              onClick={() => setShowPasswordPrompt(!showPasswordPrompt)}
              className="px-6 py-3 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white rounded-xl text-xs font-bold cursor-pointer hover:shadow-[0_4px_15px_rgba(0,212,255,0.4)] transition-all"
            >
              🔓 Unlock Owner Upload Controls
            </button>
          )}
        </div>
      </div>

      {/* Google Drive Storage Info Banner */}
      <div className="mb-6 p-4 bg-[rgba(0,212,255,0.06)] border border-[rgba(0,212,255,0.3)] rounded-2xl flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-2xl">☁️</span>
          <div>
            <p className="text-xs font-bold text-[var(--accent-primary)] uppercase font-mono">
              Cloud Storage Drive Link
            </p>
            <p className="text-xs text-[var(--text-secondary)]">
              All videos are backed up and synced with your Google Drive folder:
            </p>
          </div>
        </div>
        <a
          href={DRIVE_FOLDER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-[var(--accent-primary)] text-white rounded-lg font-bold text-xs hover:opacity-90 transition-opacity"
        >
          Open Drive Storage ↗
        </a>
      </div>

      {/* Password Authorization Prompt */}
      {!isOwnerUnlocked && showPasswordPrompt && (
        <div className="mb-8 p-6 bg-[var(--bg-primary)] rounded-2xl border border-[var(--accent-primary)] max-w-md mx-auto">
          <h3 className="text-base font-bold text-[var(--accent-primary)] mb-2 text-center">
            Owner Authorization Required
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mb-4 text-center">
            Upload tools are hidden from visitors. Enter your password to unlock.
          </p>
          <form onSubmit={handleUnlockSubmit} className="space-y-4">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter password (default: admin)"
              className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-sm focus:outline-none focus:border-[var(--accent-primary)]"
            />
            <button
              type="submit"
              className="w-full py-3 bg-[var(--accent-primary)] text-white rounded-xl font-bold text-sm cursor-pointer hover:opacity-90 transition-opacity"
            >
              Unlock Access
            </button>
            {authError && (
              <p className="text-xs text-[#ef4444] text-center font-semibold">
                Invalid password. Use admin or password.
              </p>
            )}
          </form>
        </div>
      )}

      {/* When Locked: Visitor view notice */}
      {!isOwnerUnlocked ? (
        <div className="p-8 text-center bg-[rgba(0,0,0,0.2)] rounded-2xl border border-[var(--border-color)]">
          <p className="text-sm text-[var(--text-secondary)]">
            🔒 Upload tools are private and restricted to the site owner. Visitors can view all uploaded gameplay videos and project cover images above.
          </p>
        </div>
      ) : (
        /* When Unlocked: Owner Upload Studio */
        <div className="space-y-6">
          {/* Sub Navigation: Video Upload vs Cover Image Upload */}
          <div className="flex gap-4 border-b border-[var(--border-color)] pb-4 flex-wrap">
            <button
              onClick={() => setActiveAdminTab('video')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeAdminTab === 'video'
                  ? 'bg-[var(--accent-primary)] text-white shadow-md'
                  : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              🎥 Add Gameplay Video
            </button>
            <button
              onClick={() => setActiveAdminTab('image')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeAdminTab === 'image'
                  ? 'bg-[var(--accent-primary)] text-white shadow-md'
                  : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              🖼️ Change Cover Image (JPG/PNG)
            </button>
          </div>

          {/* Tab 1: Video Upload */}
          {activeAdminTab === 'video' && (
            <form onSubmit={handleAddVideoSubmit} className="space-y-6">
              {/* Select Source Mode: File vs Google Drive URL */}
              <div className="flex gap-3 bg-[var(--bg-primary)] p-1.5 rounded-xl border border-[var(--border-color)] max-w-md">
                <button
                  type="button"
                  onClick={() => setUploadSourceMode('file')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    uploadSourceMode === 'file'
                      ? 'bg-[var(--accent-primary)] text-white'
                      : 'text-[var(--text-secondary)] hover:text-white'
                  }`}
                >
                  📁 Upload MP4 File
                </button>
                <button
                  type="button"
                  onClick={() => setUploadSourceMode('drive')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    uploadSourceMode === 'drive'
                      ? 'bg-[var(--accent-primary)] text-white'
                      : 'text-[var(--text-secondary)] hover:text-white'
                  }`}
                >
                  ☁️ Google Drive Video Link
                </button>
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-[var(--text-primary)]">
                  Video Title *
                </label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="e.g., Enemy AI Pathfinding & Combat Demo"
                  className="w-full px-5 py-3.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>

              {uploadSourceMode === 'file' ? (
                <div>
                  <label className="block mb-2 text-sm font-semibold text-[var(--text-primary)]">
                    MP4 Video File *
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-2xl py-8 px-6 text-center cursor-pointer transition-all duration-300 ${
                      selectedVideoFile
                        ? 'border-[var(--accent-primary)] bg-[rgba(0,212,255,0.08)]'
                        : 'border-[var(--border-color)] hover:border-[var(--accent-primary)] hover:bg-[rgba(0,212,255,0.03)]'
                    }`}
                    onClick={() => document.getElementById('directVideoFileInput')?.click()}
                  >
                    {selectedVideoFile ? (
                      <div className="space-y-2">
                        <p className="text-lg font-bold text-[var(--accent-primary)]">
                          🎬 Selected: {selectedVideoFile.name}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          Size: {(selectedVideoFile.size / (1024 * 1024)).toFixed(2)} MB • Type: {selectedVideoFile.type || 'MP4 Video'}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-lg font-semibold text-[var(--text-primary)] mb-1">
                          📁 Click or Drag MP4 Video File Here
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          Supports MP4, WebM • Saved to your portfolio & Google Drive storage
                        </p>
                      </div>
                    )}
                    <input
                      id="directVideoFileInput"
                      type="file"
                      accept="video/mp4,video/webm,video/*"
                      className="hidden"
                      onChange={handleVideoFileChange}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block mb-2 text-sm font-semibold text-[var(--text-primary)]">
                    Google Drive Video URL / Embed Link *
                  </label>
                  <input
                    type="url"
                    value={driveUrlInput}
                    onChange={(e) => setDriveUrlInput(e.target.value)}
                    placeholder="https://drive.google.com/file/d/... or Google Drive video link"
                    className="w-full px-5 py-3.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent-primary)] font-mono"
                  />
                  <p className="mt-2 text-xs text-[var(--text-secondary)]">
                    Link any video stored in your Google Drive folder: <a href={DRIVE_FOLDER_URL} target="_blank" rel="noopener noreferrer" className="text-[var(--accent-primary)] underline">Open Folder</a>
                  </p>
                </div>
              )}

              <div>
                <label className="block mb-2 text-sm font-semibold text-[var(--text-primary)]">
                  Video Description (displays under video player) *
                </label>
                <textarea
                  rows={4}
                  value={videoDescription}
                  onChange={(e) => setVideoDescription(e.target.value)}
                  placeholder="Write a clear description of what this gameplay clip shows (e.g. Unreal AI behavior trees, patrol spline vs freeroam AI, hearing/seeing mechanics)..."
                  className="w-full px-5 py-3.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent-primary)] resize-y leading-relaxed"
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
                {isVideoUploading ? '⏳ Uploading Video...' : '➕ Add Video to Showcase'}
              </button>
            </form>
          )}

          {/* Tab 2: JPG / PNG Cover Image Upload */}
          {activeAdminTab === 'image' && (
            <form onSubmit={handleUpdateImageSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-semibold text-[var(--text-primary)]">
                  Select Project to Change Image
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
          )}
        </div>
      )}
    </section>
  );
}

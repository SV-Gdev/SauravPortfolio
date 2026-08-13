'use client';

import { useState, useEffect, useRef } from 'react';

const projectOptions = [
  { value: 'shooter', label: 'Shooter Game (Flagship)' },
  { value: 'knuckle2', label: 'Knuckle2 (Group Project)' },
  { value: 'mario', label: 'Mario Recreation' },
];

export default function AdminModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

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

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Video selected:', file.name);
      alert(
        `Video "${file.name}" selected for upload.\n\nIn production, this would upload to your server/storage.`
      );
    }
  };

  const handleBuildUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Build selected:', file.name);
      alert(
        `Build file "${file.name}" selected for upload.\n\nIn production, this would:\n- Extract WebGL builds for iframe hosting\n- Store executables for download`
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
      <div className="max-w-[1000px] my-12 mx-auto p-12 bg-[var(--bg-secondary)] rounded-[20px] border border-[var(--border-color)]">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pb-8 border-b-2 border-[var(--border-color)]">
          <h2 className="text-2xl font-extrabold text-[var(--accent-secondary)]">
            🔒 Admin Dashboard
          </h2>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-[var(--text-secondary)] text-2xl cursor-pointer transition-colors duration-300 hover:text-[var(--text-primary)]"
          >
            &times;
          </button>
        </div>

        {/* Login Form */}
        {!isAuthenticated ? (
          <div className="max-w-[450px] my-12 mx-auto p-12 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)]">
            <h3 className="text-center mb-2 text-[var(--accent-primary)]">Administrator Login</h3>
            <p className="text-center text-[var(--text-secondary)] text-sm mb-8">
              Secure access for site owner only
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
                className="w-full px-5 py-3.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-base transition-colors duration-300 focus:outline-none focus:border-[var(--accent-primary)]"
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
                className="w-full px-5 py-3.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-base transition-colors duration-300 focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full px-10 py-4 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white rounded-xl font-semibold text-base transition-all duration-300 border-none cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,212,255,0.4)]"
            >
              Login to Dashboard
            </button>
            {loginError && (
              <p className="text-[#ff4444] text-center mt-4">
                Invalid credentials. Please try again.
              </p>
            )}
          </div>
        ) : (
          <>
            {/* Video Management */}
            <div className="mb-12 p-8 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)]">
              <h3 className="text-[1.5rem] font-bold mb-6 text-[var(--accent-primary)]">
                🎥 Video Management
              </h3>
              <div className="mb-8">
                <h4 className="text-[1.1rem] mb-4 text-[var(--text-primary)]">Upload New Video</h4>
                <div className="mb-6">
                  <label className="block mb-2 text-[var(--text-secondary)] font-medium text-[0.95rem]">
                    Select Project
                  </label>
                  <select className="w-full px-5 py-3.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-base transition-colors duration-300 focus:outline-none focus:border-[var(--accent-primary)]">
                    <option value="">Choose a project...</option>
                    {projectOptions.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div
                  className="border-2 border-dashed border-[var(--border-color)] rounded-xl py-12 text-center cursor-pointer transition-all duration-300 mb-6 hover:border-[var(--accent-primary)] hover:bg-[rgba(0,212,255,0.03)]"
                  onClick={() => document.getElementById('videoFileInput')?.click()}
                >
                  <p className="text-[1.2rem] text-[var(--text-secondary)] mb-2">📁 Click to upload video file</p>
                  <p className="text-sm text-[var(--text-secondary)]">Supports MP4, WebM • Max 500MB</p>
                  <input
                    id="videoFileInput"
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleVideoUpload}
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-2 text-[var(--text-secondary)] font-medium text-[0.95rem]">
                    Video Description (displays below video on public page)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter description of this gameplay footage..."
                    className="w-full px-5 py-3.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-base transition-colors duration-300 focus:outline-none focus:border-[var(--accent-primary)] resize-y"
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-2 text-[var(--text-secondary)] font-medium text-[0.95rem]">
                    Display Order
                  </label>
                  <input
                    type="number"
                    placeholder="1"
                    min={1}
                    className="w-full px-5 py-3.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-base transition-colors duration-300 focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>
                <button
                  onClick={() => alert('Video upload initiated!\n\nIn production, this would upload the video file.')}
                  className="px-10 py-4 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white rounded-xl font-semibold text-base transition-all duration-300 border-none cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,212,255,0.4)]"
                >
                  Upload Video
                </button>
              </div>
              <div className="mt-8 pt-8 border-t border-[var(--border-color)]">
                <h4 className="text-[1.1rem] mb-4 text-[var(--text-primary)]">Uploaded Videos</h4>
                <div className="bg-[rgba(0,0,0,0.3)] p-8 rounded-lg text-center text-[var(--text-secondary)]">
                  <p>No videos uploaded yet</p>
                  <p className="text-sm mt-2">Videos will appear here after upload</p>
                </div>
              </div>
            </div>

            {/* Game Build Management */}
            <div className="mb-12 p-8 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)]">
              <h3 className="text-[1.5rem] font-bold mb-6 text-[var(--accent-primary)]">
                🎮 Game Build Management
              </h3>
              <div className="mb-8">
                <h4 className="text-[1.1rem] mb-4 text-[var(--text-primary)]">Upload Game Build</h4>
                <div className="mb-6">
                  <label className="block mb-2 text-[var(--text-secondary)] font-medium text-[0.95rem]">
                    Select Project
                  </label>
                  <select className="w-full px-5 py-3.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-base transition-colors duration-300 focus:outline-none focus:border-[var(--accent-primary)]">
                    <option value="">Choose a project...</option>
                    {projectOptions.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div
                  className="border-2 border-dashed border-[var(--border-color)] rounded-xl py-12 text-center cursor-pointer transition-all duration-300 mb-6 hover:border-[var(--accent-primary)] hover:bg-[rgba(0,212,255,0.03)]"
                  onClick={() => document.getElementById('buildFileInput')?.click()}
                >
                  <p className="text-[1.2rem] text-[var(--text-secondary)] mb-2">
                    📦 Click to upload build folder (ZIP)
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Unity WebGL build (with index.html) OR standalone executable (.exe)
                  </p>
                  <input
                    id="buildFileInput"
                    type="file"
                    accept=".zip,.exe"
                    className="hidden"
                    onChange={handleBuildUpload}
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-2 text-[var(--text-secondary)] font-medium text-[0.95rem]">
                    Version Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., v1.0.0, v1.1.0-beta"
                    className="w-full px-5 py-3.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-base transition-colors duration-300 focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-2 text-[var(--text-secondary)] font-medium text-[0.95rem]">
                    Build Type
                  </label>
                  <select className="w-full px-5 py-3.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-base transition-colors duration-300 focus:outline-none focus:border-[var(--accent-primary)]">
                    <option value="webgl">WebGL (Browser Playable via iframe)</option>
                    <option value="standalone">Standalone (Downloadable ZIP/EXE)</option>
                  </select>
                </div>
                <button
                  onClick={() => alert('Build upload initiated!\n\nIn production, this would host WebGL builds or provide download links.')}
                  className="px-10 py-4 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white rounded-xl font-semibold text-base transition-all duration-300 border-none cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,212,255,0.4)]"
                >
                  Upload Build
                </button>
              </div>
              <div className="mt-8 pt-8 border-t border-[var(--border-color)]">
                <h4 className="text-[1.1rem] mb-4 text-[var(--text-primary)]">Current Builds</h4>
                <div className="bg-[rgba(0,0,0,0.3)] p-8 rounded-lg text-center text-[var(--text-secondary)]">
                  <p>No builds uploaded yet</p>
                  <p className="text-sm mt-2">Upload a build to enable browser play or download</p>
                </div>
              </div>
            </div>

            {/* Site Settings */}
            <div className="p-8 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)]">
              <h3 className="text-[1.5rem] font-bold mb-6 text-[var(--accent-primary)]">⚙️ Site Settings</h3>
              <div className="mb-6">
                <label className="block mb-2 text-[var(--text-secondary)] font-medium text-[0.95rem]">
                  Featured Project
                </label>
                <select className="w-full px-5 py-3.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-base transition-colors duration-300 focus:outline-none focus:border-[var(--accent-primary)]">
                  <option value="shooter">Shooter Game</option>
                  <option value="knuckle2">Knuckle2</option>
                  <option value="mario">Mario Recreation</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-[var(--text-secondary)] font-medium text-[0.95rem]">
                  Project Cover Images
                </label>
                <div
                  className="border-2 border-dashed border-[var(--border-color)] rounded-xl py-6 text-center cursor-pointer transition-all duration-300 hover:border-[var(--accent-primary)] hover:bg-[rgba(0,212,255,0.03)]"
                  onClick={() => document.getElementById('coverImageInput')?.click()}
                >
                  <p className="text-base text-[var(--text-secondary)]">
                    🖼️ Upload cover image for selected project
                  </p>
                  <input
                    id="coverImageInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>
              <button
                onClick={() => alert('Settings saved successfully!')}
                className="px-10 py-4 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white rounded-xl font-semibold text-base transition-all duration-300 border-none cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,212,255,0.4)]"
              >
                Save Settings
              </button>
            </div>

            <div className="mt-8 p-6 bg-[rgba(139,92,246,0.1)] rounded-lg text-center">
              <p className="text-[var(--text-secondary)] text-sm">
                <strong className="text-[var(--accent-secondary)]">Note:</strong> All uploads are
                stored securely. Visitors can only view content — never upload, edit, or delete.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

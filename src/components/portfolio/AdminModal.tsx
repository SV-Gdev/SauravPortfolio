'use client';

import { useState, useEffect, useRef } from 'react';
import { useProjectStore } from '@/hooks/useProjectStore';

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

  // Cover Image Upload State
  const [selectedImageProject, setSelectedImageProject] = useState('shooter');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [imageMessage, setImageMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { updateProjectImage } = useProjectStore();

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
            🔒 Admin Dashboard — Cover Image & Build Manager
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

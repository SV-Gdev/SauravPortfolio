'use client';

import { useState, useEffect, useCallback } from 'react';

export interface GameplayVideo {
  id: string;
  title: string;
  project: string;
  description?: string;
  videoUrl: string;
  isLocal?: boolean;
  createdAt: string;
}

const LOCAL_STORAGE_KEY = 'saurav_portfolio_videos_v1';

export function useVideoStore() {
  const [videos, setVideos] = useState<GameplayVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVideos = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/videos');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.videos)) {
          setVideos(data.videos);
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.videos));
          } catch (e) {
            console.error('Failed to update localStorage cache:', e);
          }
          return;
        }
      }
    } catch (e) {
      console.warn('API fetch failed, falling back to localStorage cache:', e);
    } finally {
      setIsLoading(false);
    }

    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        setVideos(JSON.parse(cached));
      }
    } catch (err) {
      console.error('Error reading localStorage cache:', err);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const addVideoWithFile = async (
    title: string,
    project: string,
    description: string,
    file?: File | null,
    videoUrl?: string
  ) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('project', project);
    formData.append('description', description);

    if (file) {
      formData.append('file', file);
    } else if (videoUrl) {
      formData.append('videoUrl', videoUrl);
    }

    const res = await fetch('/api/videos', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to upload video');
    }

    setVideos(data.videos);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.videos));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
    return data.video;
  };

  const deleteVideo = async (id: string) => {
    const res = await fetch(`/api/videos?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to delete video');
    }

    setVideos(data.videos);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.videos));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  };

  return {
    videos,
    isLoading,
    fetchVideos,
    addVideoWithFile,
    deleteVideo,
  };
}

'use client';

import { useState, useEffect, useCallback } from 'react';

export interface VideoItem {
  id: string;
  projectId: string;
  title: string;
  description: string;
  url: string;
  fileName?: string;
  fileSize?: number;
  displayOrder: number;
  createdAt: string;
}

const STORAGE_KEY = 'saurav_portfolio_videos_v1';

export function useVideoStore() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync state with server & localStorage
  const loadVideos = useCallback(async () => {
    setLoading(true);
    let loadedFromApi = false;

    try {
      const res = await fetch('/api/videos');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.videos)) {
          setVideos(data.videos);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.videos));
          loadedFromApi = true;
        }
      }
    } catch (e) {
      console.warn('Could not fetch videos from API, loading from localStorage', e);
    }

    if (!loadedFromApi) {
      try {
        const localData = localStorage.getItem(STORAGE_KEY);
        if (localData) {
          setVideos(JSON.parse(localData));
        }
      } catch (e) {
        console.error('Failed to parse local storage videos', e);
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const addVideoRecord = async (newVideo: VideoItem) => {
    const updated = [newVideo, ...videos.filter((v) => v.id !== newVideo.id)];
    setVideos(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }

    try {
      await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video: newVideo }),
      });
    } catch (e) {
      console.error('API save error:', e);
    }
  };

  const deleteVideo = async (id: string) => {
    const updated = videos.filter((v) => v.id !== id);
    setVideos(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('LocalStorage delete error:', e);
    }

    try {
      await fetch(`/api/videos?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.error('API delete error:', e);
    }
  };

  const uploadVideoFile = async (
    file: File,
    metadata: {
      projectId: string;
      title: string;
      description: string;
      displayOrder: number;
    }
  ): Promise<VideoItem> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', metadata.projectId);
    formData.append('title', metadata.title);
    formData.append('description', metadata.description);
    formData.append('displayOrder', metadata.displayOrder.toString());

    let createdVideo: VideoItem;

    try {
      const res = await fetch('/api/videos/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Server upload failed');
      }

      const data = await res.json();
      createdVideo = data.video;
    } catch (err: any) {
      console.warn('API upload failed, creating client-side object URL fallback:', err);
      const objectUrl = URL.createObjectURL(file);
      createdVideo = {
        id: `vid_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        projectId: metadata.projectId,
        title: metadata.title || file.name,
        description: metadata.description,
        url: objectUrl,
        fileName: file.name,
        fileSize: file.size,
        displayOrder: metadata.displayOrder,
        createdAt: new Date().toISOString(),
      };
    }

    await addVideoRecord(createdVideo);
    return createdVideo;
  };

  const getVideosByProject = useCallback(
    (projectId: string) => {
      return videos.filter(
        (v) => v.projectId === projectId || v.projectId === 'all' || projectId === 'all'
      );
    },
    [videos]
  );

  return {
    videos,
    loading,
    uploadVideoFile,
    addVideo: addVideoRecord,
    addVideoRecord,
    deleteVideo,
    getVideosByProject,
    refreshVideos: loadVideos,
  };
}

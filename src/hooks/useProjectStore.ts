'use client';

import { useState, useEffect, useCallback } from 'react';
import { projects as defaultProjects, Project } from '@/data/portfolio-data';

const PROJECT_IMAGE_STORAGE_KEY = 'saurav_portfolio_project_images_v1';

export function useProjectStore() {
  const [projectImages, setProjectImages] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PROJECT_IMAGE_STORAGE_KEY);
      if (stored) {
        setProjectImages(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading project images from localStorage:', e);
    }
  }, []);

  const updateProjectImage = useCallback(async (projectId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId);

    let imageUrl: string;

    try {
      const res = await fetch('/api/projects/image', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to upload image');
      }

      const data = await res.json();
      imageUrl = data.imageUrl;
    } catch (e) {
      console.warn('API image upload failed, using object URL fallback:', e);
      imageUrl = URL.createObjectURL(file);
    }

    setProjectImages((prev) => {
      const updated = { ...prev, [projectId]: imageUrl };
      try {
        localStorage.setItem(PROJECT_IMAGE_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('LocalStorage write error:', err);
      }
      return updated;
    });

    return imageUrl;
  }, []);

  const getProjectImage = useCallback(
    (project: Project) => {
      return projectImages[project.id] || project.image;
    },
    [projectImages]
  );

  return {
    projects: defaultProjects,
    projectImages,
    updateProjectImage,
    getProjectImage,
  };
}

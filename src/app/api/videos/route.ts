import { NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';

export interface GameplayVideo {
  id: string;
  title: string;
  project: string;
  description?: string;
  videoUrl: string;
  isLocal?: boolean;
  createdAt: string;
}

const VIDEOS_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'videos.json');
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'videos');

async function getVideos(): Promise<GameplayVideo[]> {
  try {
    const data = await readFile(VIDEOS_FILE_PATH, 'utf-8');
    if (!data.trim()) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveVideos(videos: GameplayVideo[]): Promise<void> {
  await mkdir(path.dirname(VIDEOS_FILE_PATH), { recursive: true });
  await writeFile(VIDEOS_FILE_PATH, JSON.stringify(videos, null, 2), 'utf-8');
}

export async function GET() {
  try {
    const videos = await getVideos();
    return NextResponse.json({ success: true, videos });
  } catch (error: any) {
    console.error('Error fetching videos:', error);
    return NextResponse.json({ success: false, error: 'Failed to load videos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let videoUrl = '';
    let title = '';
    let project = 'Shooter Game';
    let description = '';
    let isLocal = false;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      title = (formData.get('title') as string) || 'Gameplay Video';
      project = (formData.get('project') as string) || 'Shooter Game';
      description = (formData.get('description') as string) || '';
      const urlInput = (formData.get('videoUrl') as string) || '';

      if (file) {
        const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
        if (!validTypes.includes(file.type.toLowerCase()) && !file.name.match(/\.(mp4|webm|ogg|mov)$/i)) {
          return NextResponse.json(
            { error: 'Invalid video format. Please upload MP4, WebM, or MOV files.' },
            { status: 400 }
          );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        await mkdir(UPLOAD_DIR, { recursive: true });
        const sanitized = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${Date.now()}_${sanitized}`;
        const filePath = path.join(UPLOAD_DIR, filename);

        await writeFile(filePath, buffer);
        videoUrl = `/uploads/videos/${filename}`;
        isLocal = true;
      } else if (urlInput) {
        videoUrl = urlInput;
      } else {
        return NextResponse.json({ error: 'Please provide either a video file or a video URL.' }, { status: 400 });
      }
    } else {
      const body = await request.json();
      title = body.title || 'Gameplay Video';
      project = body.project || 'Shooter Game';
      description = body.description || '';
      videoUrl = body.videoUrl || '';

      if (!videoUrl) {
        return NextResponse.json({ error: 'Video URL is required.' }, { status: 400 });
      }
    }

    const newVideo: GameplayVideo = {
      id: `vid_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      title,
      project,
      description,
      videoUrl,
      isLocal,
      createdAt: new Date().toISOString(),
    };

    const currentVideos = await getVideos();
    const updatedVideos = [newVideo, ...currentVideos];
    await saveVideos(updatedVideos);

    return NextResponse.json({ success: true, video: newVideo, videos: updatedVideos });
  } catch (error: any) {
    console.error('Error adding video:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to add video' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');

    if (!id) {
      try {
        const body = await request.json();
        id = body.id;
      } catch {
        // empty
      }
    }

    if (!id) {
      return NextResponse.json({ error: 'Video ID is required for deletion.' }, { status: 400 });
    }

    const currentVideos = await getVideos();
    const updatedVideos = currentVideos.filter((v) => v.id !== id);
    await saveVideos(updatedVideos);

    return NextResponse.json({ success: true, videos: updatedVideos });
  } catch (error: any) {
    console.error('Error deleting video:', error);
    return NextResponse.json({ error: error?.message || 'Failed to delete video' }, { status: 500 });
  }
}

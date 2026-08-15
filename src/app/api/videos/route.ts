import { NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'videos.json');

async function getStoredVideos() {
  try {
    const data = await readFile(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveStoredVideos(videos: any[]) {
  try {
    const dir = path.dirname(dataFilePath);
    await mkdir(dir, { recursive: true });
    await writeFile(dataFilePath, JSON.stringify(videos, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving videos to file:', err);
  }
}

export async function GET() {
  const videos = await getStoredVideos();
  return NextResponse.json({ videos });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { video } = body;
    if (!video || !video.id) {
      return NextResponse.json({ error: 'Invalid video payload' }, { status: 400 });
    }

    const currentVideos = await getStoredVideos();
    const existingIndex = currentVideos.findIndex((v: any) => v.id === video.id);

    if (existingIndex >= 0) {
      currentVideos[existingIndex] = { ...currentVideos[existingIndex], ...video };
    } else {
      currentVideos.unshift(video);
    }

    await saveStoredVideos(currentVideos);
    return NextResponse.json({ success: true, videos: currentVideos });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to save video' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing video ID' }, { status: 400 });
    }

    let currentVideos = await getStoredVideos();
    currentVideos = currentVideos.filter((v: any) => v.id !== id);

    await saveStoredVideos(currentVideos);
    return NextResponse.json({ success: true, videos: currentVideos });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to delete video' }, { status: 500 });
  }
}

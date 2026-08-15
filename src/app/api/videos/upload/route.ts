import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const projectId = (formData.get('projectId') as string) || 'shooter';
    const title = (formData.get('title') as string) || 'Gameplay Video';
    const description = (formData.get('description') as string) || '';
    const displayOrder = parseInt((formData.get('displayOrder') as string) || '1', 10);

    if (!file) {
      return NextResponse.json({ error: 'No video file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure upload directory exists inside public/uploads/videos
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
    await mkdir(uploadDir, { recursive: true });

    // Clean filename and make unique
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${Date.now()}_${sanitizedFileName}`;
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);

    const videoUrl = `/uploads/videos/${filename}`;

    const newVideo = {
      id: `vid_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      projectId,
      title: title || file.name,
      description,
      url: videoUrl,
      fileName: file.name,
      fileSize: file.size,
      displayOrder,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, video: newVideo });
  } catch (error: any) {
    console.error('Error uploading video:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to upload video file' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const projectId = (formData.get('projectId') as string) || 'shooter';

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase()) && !file.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
      return NextResponse.json(
        { error: 'Invalid image format. Please select a JPG or PNG image file.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'images');
    await mkdir(uploadDir, { recursive: true });

    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${Date.now()}_${sanitizedFileName}`;
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);

    const imageUrl = `/uploads/images/${filename}`;

    return NextResponse.json({
      success: true,
      projectId,
      imageUrl,
      fileName: file.name,
    });
  } catch (error: any) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}

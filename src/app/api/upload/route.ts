import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/upload
 * Handles file uploads to Vercel Blob Storage
 */
export async function POST(request: NextRequest) {
  try {
    // Get the file from the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: 'Invalid file type',
          details: `Allowed types: ${allowedTypes.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: 'File too large',
          details: `Maximum size: ${maxSize / 1024 / 1024}MB`,
        },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || 'png';
    const filename = `upload_${timestamp}.${extension}`;
    const blobPath = `images/${filename}`;

    // Upload to Vercel Blob
    const blob = await put(blobPath, file, {
      access: 'public',
      contentType: file.type,
    });

    console.log('✅ File uploaded to Vercel Blob:', blob.url);

    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType || file.type,
      size: file.size,
    });
  } catch (error) {
    console.error('🔴 Upload error:', error);
    return NextResponse.json(
      {
        error: 'Upload failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Configure route to handle larger files
export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds

/**
 * Vercel Blob Storage Utility
 * 
 * This module provides utilities for managing image uploads to Vercel Blob Storage.
 * It follows best practices including:
 * - Type safety with TypeScript
 * - Error handling and validation
 * - Support for multiple file formats
 * - Automatic content type detection
 * - Unique filename generation
 */

import { del, list, put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';

export interface UploadResult {
  url: string;
  pathname: string;
  contentType: string;
  size: number;
}

export interface UploadError {
  error: string;
  details?: string;
}

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Upload an image to Vercel Blob Storage
 * @param file - The file to upload (File or Blob)
 * @param filename - Optional custom filename (will generate UUID if not provided)
 * @returns Upload result with URL and metadata
 */
export async function uploadImageToBlob(
  file: File | Blob,
  filename?: string
): Promise<UploadResult | UploadError> {
  try {
    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return {
        error: 'Invalid file type',
        details: `Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
      };
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        error: 'File too large',
        details: `Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      };
    }

    // Generate unique filename if not provided
    const extension = file.type.split('/')[1];
    const uniqueFilename = filename || `${uuidv4()}.${extension}`;

    // Upload to Vercel Blob
    const blob = await put(uniqueFilename, file, {
      access: 'public',
      contentType: file.type,
    });

    return {
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType || file.type,
      size: file.size,
    };
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    return {
      error: 'Upload failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Upload image from URL to Vercel Blob Storage
 * Useful for fetching images from external sources
 * @param imageUrl - The URL of the image to upload
 * @param filename - Optional custom filename
 * @returns Upload result with URL and metadata
 */
export async function uploadImageFromUrl(
  imageUrl: string,
  filename?: string
): Promise<UploadResult | UploadError> {
  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      return {
        error: 'Failed to fetch image',
        details: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    // Get the blob
    const blob = await response.blob();

    // Upload using the existing function
    return uploadImageToBlob(blob, filename);
  } catch (error) {
    console.error('Error fetching image from URL:', error);
    return {
      error: 'Failed to fetch image',
      details: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Delete an image from Vercel Blob Storage
 * @param url - The full URL of the blob to delete
 * @returns Success status
 */
export async function deleteImageFromBlob(
  url: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await del(url);
    return { success: true };
  } catch (error) {
    console.error('Error deleting from Vercel Blob:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * List all blobs with optional prefix filter
 * @param prefix - Optional prefix to filter blobs
 * @returns List of blob URLs
 */
export async function listBlobs(prefix?: string) {
  try {
    const { blobs } = await list(prefix ? { prefix } : undefined);
    return blobs;
  } catch (error) {
    console.error('Error listing blobs:', error);
    return [];
  }
}

/**
 * Generate a placeholder image URL from Unsplash
 * Useful for development and testing
 * @param width - Image width
 * @param height - Image height
 * @param query - Search query for specific image type
 * @returns Unsplash image URL
 */
export function getPlaceholderImageUrl(
  width: number = 800,
  height: number = 600,
  query: string = 'presentation,slides,business'
): string {
  return `https://source.unsplash.com/random/${width}x${height}/?${query}`;
}

/**
 * Fetch and upload a placeholder image to Vercel Blob
 * @param query - Search query for the placeholder image
 * @param filename - Optional filename
 * @returns Upload result
 */
export async function uploadPlaceholderImage(
  query: string = 'presentation,slides,business',
  filename?: string
): Promise<UploadResult | UploadError> {
  const placeholderUrl = getPlaceholderImageUrl(800, 600, query);
  return uploadImageFromUrl(placeholderUrl, filename);
}

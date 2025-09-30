# Vercel Blob Storage Setup Guide

This guide explains how to set up and use Vercel Blob Storage for image management in the Slide AI application.

## 🚀 Quick Setup

### 1. Create a Vercel Blob Store

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to the **Storage** tab
3. Click **Create Database** and select **Blob**
4. Name your store (e.g., "slide-ai-images")
5. Click **Create**

### 2. Get Your Token

1. After creating the store, you'll see your `BLOB_READ_WRITE_TOKEN`
2. Copy this token
3. Add it to your `.env.local` file:

```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_XXXXXXXXXX
```

### 3. Install Dependencies

The `@vercel/blob` package is already included in `package.json`. If you need to reinstall:

```bash
npm install @vercel/blob uuid
# or
bun install @vercel/blob uuid
```

## 📝 Usage

### Uploading Images

#### From a File

```typescript
import { uploadImageToBlob } from '@/lib/blob';

const result = await uploadImageToBlob(file, 'custom-filename.jpg');
if ('url' in result) {
  console.log('Uploaded:', result.url);
}
```

#### From a URL

```typescript
import { uploadImageFromUrl } from '@/lib/blob';

const result = await uploadImageFromUrl(
  'https://example.com/image.jpg',
  'custom-filename.jpg'
);
```

#### Upload Placeholder Images

```typescript
import { uploadPlaceholderImage } from '@/lib/blob';

// Get a random image from Unsplash
const result = await uploadPlaceholderImage(
  'presentation,slides,business',
  'thumbnail.jpg'
);
```

### Generating Project Thumbnails

#### For a Single Project

```typescript
import { generateProjectThumbnail } from '@/actions/thumbnail';

const result = await generateProjectThumbnail(projectId);
```

#### For All Projects Without Thumbnails

```typescript
import { generateMissingThumbnails } from '@/actions/thumbnail';

const result = await generateMissingThumbnails();
```

### Deleting Images

```typescript
import { deleteImageFromBlob } from '@/lib/blob';

const result = await deleteImageFromBlob(imageUrl);
```

## 🎨 Features

- ✅ **Type-safe**: Full TypeScript support
- ✅ **Validation**: File type and size validation
- ✅ **Error handling**: Comprehensive error messages
- ✅ **Automatic naming**: UUID-based unique filenames
- ✅ **Placeholder images**: Unsplash integration for development
- ✅ **Batch operations**: Generate thumbnails for multiple projects
- ✅ **Performance**: Optimized image loading with lazy loading

## 🔒 Security

- File type restrictions (images only)
- Maximum file size: 10MB
- Public access URLs for easy sharing
- Content type validation

## 📊 Performance Benefits

1. **Faster Loading**: Images served from Vercel's global CDN
2. **Optimized Storage**: Automatic compression and optimization
3. **Better UX**: Lazy loading reduces initial page load
4. **Scalability**: No server-side image processing needed

## 🛠 Maintenance

### List All Blobs

```typescript
import { listBlobs } from '@/lib/blob';

const blobs = await listBlobs();
console.log('Total blobs:', blobs.length);
```

### Clean Up Old Thumbnails

When deleting a project, remember to also delete its thumbnail:

```typescript
import { deleteImageFromBlob } from '@/lib/blob';

if (project.thumbnail) {
  await deleteImageFromBlob(project.thumbnail);
}
```

## 🔗 Resources

- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [Blob API Reference](https://vercel.com/docs/storage/vercel-blob/using-blob-sdk)
- [Best Practices](https://vercel.com/docs/storage/vercel-blob/best-practices)

## 🐛 Troubleshooting

### "Token is invalid"

- Make sure `BLOB_READ_WRITE_TOKEN` is set in your `.env.local`
- Verify the token hasn't expired
- Check you're using the correct token for your environment

### "File too large"

- Maximum file size is 10MB
- Consider compressing images before upload
- Use image optimization tools

### "Upload failed"

- Check your network connection
- Verify Vercel Blob service status
- Check your Vercel account limits

## 📈 Next Steps

1. Set up automatic thumbnail generation on project creation
2. Implement image caching strategies
3. Add image transformation (resize, crop) if needed
4. Monitor blob storage usage in Vercel dashboard

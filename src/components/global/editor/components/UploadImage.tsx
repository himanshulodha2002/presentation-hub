"use client";

import { FileUploaderRegular } from "@uploadcare/react-uploader/next";
import "@uploadcare/react-uploader/core.css";
import { useState, useCallback } from "react";

type Props = {
  contentId: string;
  onContentChange: (
    contentId: string,
    newContent: string | string[] | string[][]
  ) => void;
};

function UploadImage({ contentId, onContentChange }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Check if Uploadcare key is configured
  const uploadcareKey = process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY;

  console.log('🔍 UploadImage component rendered for contentId:', contentId);
  console.log('🔍 Uploadcare key configured:', !!uploadcareKey);

  if (!uploadcareKey) {
    console.error('🔴 NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY is not configured');
    return (
      <div className="p-2 bg-red-100 text-red-700 rounded text-xs">
        Uploadcare not configured. Add NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY to .env
      </div>
    );
  }

  const handleFileUploadStart = useCallback(() => {
    console.log('🟢 [START] Upload started for contentId:', contentId);
    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);
  }, [contentId]);

  const handleChangeEvent = useCallback((e: any) => {
    console.log('🔍 [CHANGE] Event received:', e);
    console.log('🔍 [CHANGE] Event detail:', e?.detail);

    // Try to extract progress from various possible locations
    const progress =
      e?.detail?.uploadProgress ||
      e?.detail?.progress ||
      e?.progress ||
      0;

    if (progress > 0 && progress <= 100) {
      setUploadProgress(progress);
      console.log(`🟢 [PROGRESS] ${progress}%`);
    }
  }, []);

  const handleFileUploadSuccess = useCallback((e: { cdnUrl: string | string[] | string[][] }) => {
    console.log('🟢 [SUCCESS] Upload successful:', e.cdnUrl);
    console.log('🟢 [SUCCESS] Full event:', e);

    // Handle the URL properly
    let imageUrl = typeof e.cdnUrl === 'string' ? e.cdnUrl : '';

    // Remove trailing slash from Uploadcare URL
    if (imageUrl.endsWith('/')) {
      imageUrl = imageUrl.slice(0, -1);
    }

    // Transform ucarecdn.com URLs to use the proper CDN subdomain format
    // Uploadcare returns: https://ucarecdn.com/UUID/
    // But we need: https://ucarecdn.com/UUID (without trailing slash)
    // The CDN should handle this automatically

    console.log('🟢 [SUCCESS] Cleaned URL:', imageUrl);

    // Verify the URL is valid
    if (!imageUrl || !imageUrl.includes('ucarecdn')) {
      console.error('🔴 [ERROR] Invalid Uploadcare URL:', imageUrl);
      setUploadError('Invalid image URL received from Uploadcare');
      setIsUploading(false);
      return;
    }

    setIsUploading(false);
    setUploadProgress(100);
    setUploadError(null);

    try {
      console.log('🟢 [SUCCESS] Calling onContentChange with URL:', imageUrl);
      onContentChange(contentId, imageUrl);
      console.log('🟢 [SUCCESS] onContentChange completed');
    } catch (error) {
      console.error('🔴 [ERROR] onContentChange failed:', error);
      setUploadError('Failed to update image');
      setIsUploading(false);
    }
  }, [contentId, onContentChange]);

  const handleFileUploadFailed = useCallback((e: any) => {
    console.error('🔴 [FAILED] Upload failed:', e);
    console.error('🔴 [FAILED] Error detail:', e?.detail);

    const errorMessage = e?.detail?.message || e?.message || 'Upload failed';
    console.error('🔴 [FAILED] Error message:', errorMessage);

    setIsUploading(false);
    setUploadError(errorMessage);
    setUploadProgress(0);
  }, []);

  console.log('🔍 Render state:', { isUploading, uploadProgress, uploadError });

  return (
    <div className="relative">
      {/* Debug info - remove this later */}
      <div className="text-xs text-gray-500 mb-1">
        Status: {isUploading ? 'Uploading' : 'Ready'} | Progress: {uploadProgress}%
      </div>

      {isUploading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded">
          <div className="bg-white p-3 rounded-lg shadow-lg">
            <div className="text-sm font-medium mb-2">Uploading...</div>
            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1 text-center">
              {uploadProgress}%
            </div>
            <button
              onClick={() => {
                console.log('🔴 Force reset upload state');
                setIsUploading(false);
                setUploadError(null);
                setUploadProgress(0);
              }}
              className="mt-2 text-xs text-red-600 underline"
            >
              Cancel / Reset
            </button>
          </div>
        </div>
      )}

      {uploadError && (
        <div className="absolute top-0 left-0 right-0 bg-red-100 text-red-700 text-xs p-2 rounded z-10">
          {uploadError}
          <button
            onClick={() => setUploadError(null)}
            className="ml-2 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <FileUploaderRegular
        sourceList="local, url, dropbox"
        classNameUploader="uc-light"
        pubkey={uploadcareKey}
        multiple={false}
        onFileUploadSuccess={handleFileUploadSuccess}
        onFileUploadFailed={handleFileUploadFailed}
        onFileUploadStart={handleFileUploadStart}
        onChange={handleChangeEvent}
        maxLocalFileSizeBytes={10000000}
        imgOnly={true}
        accept="image/*"
      />
    </div>
  );
}

export default UploadImage;
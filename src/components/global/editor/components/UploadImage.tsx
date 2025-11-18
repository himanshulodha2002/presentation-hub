"use client";

import { useState, useCallback, useRef } from "react";
import { Upload } from "lucide-react";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setUploadError('File size must be less than 10MB');
      return;
    }

    console.log('🟢 [START] Upload started for contentId:', contentId);
    console.log('🟢 [START] File:', file.name, file.type, file.size);

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress (since fetch doesn't support upload progress natively)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + 10;
        });
      }, 100);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      console.log('🟢 [SUCCESS] Upload successful:', data.url);

      setUploadProgress(100);
      setIsUploading(false);
      setUploadError(null);

      // Update the image URL
      onContentChange(contentId, data.url);
      console.log('🟢 [SUCCESS] Image URL updated');

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('🔴 [ERROR] Upload failed:', error);
      setIsUploading(false);
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
      setUploadProgress(0);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [contentId, onContentChange]);

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleCancelUpload = useCallback(() => {
    console.log('🔴 Cancel upload');
    setIsUploading(false);
    setUploadError(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <div className="relative">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />

      {/* Upload button */}
      <button
        onClick={handleButtonClick}
        disabled={isUploading}
        className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg text-sm transition-colors"
      >
        <Upload size={16} />
        {isUploading ? 'Uploading...' : 'Upload Image'}
      </button>

      {/* Progress overlay */}
      {isUploading && (
        <div className="absolute top-full left-0 mt-2 bg-white p-3 rounded-lg shadow-lg border border-gray-200 min-w-[200px] z-10">
          <div className="text-sm font-medium mb-2">Uploading...</div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1 text-center">
            {uploadProgress}%
          </div>
          <button
            onClick={handleCancelUpload}
            className="mt-2 text-xs text-red-600 hover:text-red-700 underline w-full"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Error message */}
      {uploadError && (
        <div className="absolute top-full left-0 mt-2 bg-red-100 text-red-700 text-xs p-2 rounded border border-red-200 min-w-[200px] z-10">
          {uploadError}
          <button
            onClick={() => setUploadError(null)}
            className="ml-2 underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

export default UploadImage;

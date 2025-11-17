"use client";

import { FileUploaderRegular } from "@uploadcare/react-uploader/next";
import "@uploadcare/react-uploader/core.css";
import { useState } from "react";

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

  if (!uploadcareKey) {
    return (
      <div className="p-2 bg-red-100 text-red-700 rounded text-xs">
        Uploadcare not configured. Add NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY to .env
      </div>
    );
  }

  const handleFileUploadStart = () => {
    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);
    console.log('🟢 Upload started');
  };

  const handleChangeEvent = (e: any) => {
    // Track upload progress from change events
    const progress = e?.detail?.uploadProgress || 0;
    if (progress > 0 && progress < 100) {
      setUploadProgress(progress);
      console.log(`🟢 Upload progress: ${progress}%`);
    }
  };

  const handleFileUploadSuccess = (e: { cdnUrl: string | string[] | string[][] }) => {
    console.log('🟢 Upload successful:', e.cdnUrl);
    setIsUploading(false);
    setUploadProgress(100);
    setUploadError(null);

    try {
      onContentChange(contentId, e.cdnUrl);
    } catch (error) {
      console.error('🔴 Error calling onContentChange:', error);
      setUploadError('Failed to update image');
    }
  };

  const handleFileUploadFailed = (e: any) => {
    const errorMessage = e?.detail?.message || e?.message || 'Upload failed';
    console.error('🔴 Upload error:', errorMessage);
    setIsUploading(false);
    setUploadError(errorMessage);
  };

  return (
    <div className="relative">
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
          </div>
        </div>
      )}

      {uploadError && (
        <div className="absolute top-0 left-0 right-0 bg-red-100 text-red-700 text-xs p-2 rounded z-10">
          {uploadError}
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
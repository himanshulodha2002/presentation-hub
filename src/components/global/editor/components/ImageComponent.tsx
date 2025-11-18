import Image from "next/image";
import React, { useState } from "react";
import UploadImage from "./UploadImage";

type Props = {
    src: string;
    alt: string;
    className?: string;
    isPreview?: boolean;
    contentId: string;
    onContentChange: (
        contentId: string,
        newContent: string | string[] | string[][]
    ) => void;
    isEditable?: boolean;
};

const CustomImage = ({
    src,
    alt,
    className,
    isPreview = false,
    contentId,
    onContentChange,
    isEditable = true,
}: Props) => {
    const [imageError, setImageError] = useState(false);

    // Check if URL is from Uploadcare (bypass Next.js optimization for these)
    const isUploadcareUrl = src.includes('ucarecdn.com') || src.includes('ucarecdn.net');

    // Add preview transformation to Uploadcare URLs if needed
    let finalSrc = src;
    if (isUploadcareUrl && !src.includes('/-/')) {
      // Remove trailing slash first
      const cleanUrl = src.endsWith('/') ? src.slice(0, -1) : src;
      // Add preview transformation (no trailing slash at end)
      finalSrc = cleanUrl + '/-/preview/';
      console.log('🔍 Original URL:', src);
      console.log('🔍 Transformed URL:', finalSrc);
    }

    // If image failed to load or is from Uploadcare, use unoptimized
    const shouldBypassOptimization = imageError || isUploadcareUrl;

    return (
        <div className={`relative group w-full  h-full  rounded-lg`}>
            {imageError ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                    <div className="text-center p-4">
                        <p className="text-sm text-gray-600 mb-2">Failed to load image</p>
                        <p className="text-xs text-gray-400">URL: {src.substring(0, 50)}...</p>
                    </div>
                </div>
            ) : (
                <Image
                    src={finalSrc}
                    width={isPreview ? 48 : 800}
                    height={isPreview ? 48 : 800}
                    alt={alt}
                    className={`object-cover  w-full h-full rounded-lg ${className}`}
                    unoptimized={shouldBypassOptimization}
                    onError={(e) => {
                        console.error('🔴 Image failed to load:', finalSrc);
                        console.error('🔴 Original src:', src);
                        console.error('🔴 Error event:', e);
                        setImageError(true);
                    }}
                    onLoadingComplete={() => {
                        console.log('✅ Image loaded successfully:', finalSrc);
                    }}
                />
            )}
            {!isPreview && isEditable && (
                <div className="absolute top-0 left-0 hidden group-hover:block">
                    <UploadImage
                        contentId={contentId}
                        onContentChange={onContentChange}
                    />
                </div>
            )}
        </div>
    );
};

export default CustomImage;
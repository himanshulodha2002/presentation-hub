/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable strict mode to help with hydration errors
  reactStrictMode: false,

  // Configure external packages (including Prisma for serverless)
  serverExternalPackages: ["pptxgenjs", "@prisma/client", "prisma"],

  // Configure image domains with remotePatterns
  images: {
    remotePatterns: [
      // Uploadcare domains (DEPRECATED - kept for backward compatibility with existing images)
      // New uploads use Vercel Blob Storage
      {
        protocol: "https",
        hostname: "ucarecdn.com",
      },
      {
        protocol: "https",
        hostname: "*.ucarecdn.com",
      },
      {
        protocol: "https",
        hostname: "ucarecdn.net",
      },
      {
        protocol: "https",
        hostname: "*.ucarecdn.net",
      },
      // Vercel Blob Storage
      {
        protocol: "https",
        hostname: "ptictyardjhsymt6.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
      // OpenAI DALL-E
      {
        protocol: "https",
        hostname: "oaidalleapiprodscus.blob.core.windows.net",
      },
      // Placeholder services
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      // Cloudinary
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      // Unsplash
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    // Add dangerouslyAllowSVG for potential SVG image support
    dangerouslyAllowSVG: true,
  },

  // ESLint configuration to ignore certain errors during build
  eslint: {
    // Ignore ESLint errors during builds
    ignoreDuringBuilds: true,
  },

  // Webpack configuration for non-Turbopack environments
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    return config;
  },
};

module.exports = nextConfig;

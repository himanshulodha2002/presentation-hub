/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable strict mode to help with hydration errors
  reactStrictMode: false,

  // Configure external packages
  serverExternalPackages: ["pptxgenjs"],

  // Configure image domains with remotePatterns
  images: {
    remotePatterns: [
      // Vercel Blob Storage (primary image storage)
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "**.blob.vercel-storage.com",
      },
      // OpenAI DALL-E (for AI-generated images)
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

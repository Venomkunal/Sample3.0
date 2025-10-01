import type { NextConfig } from 'next';

// Load environment variables
const imageHost = process.env.NEXT_PUBLIC_IMAGE_HOST || 'localhost';
const imagePort = process.env.NEXT_PUBLIC_IMAGE_PORT || 'localhost';

const nextConfig: NextConfig = {
  images: {
    // domains: ['res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: imageHost, // ✅ dynamic from env
        port: imagePort,
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
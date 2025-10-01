import type { NextConfig } from 'next';

// Load environment variables
const imageHost = process.env.NEXT_PUBLIC_IMAGE_HOST || 'localhost';
const imagePort = process.env.NEXT_PUBLIC_IMAGE_PORT || '5000';

const nextConfig: NextConfig = {
  images: {
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
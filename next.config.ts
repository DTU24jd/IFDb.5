import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.tvmaze.com',
        port: '',
        pathname: '/uploads/images/**',
      },
    ],
  },
};

export default nextConfig;

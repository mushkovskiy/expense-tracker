import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/types', '@repo/config', '@repo/validation'],
};

export default nextConfig;

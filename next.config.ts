import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Initialize OpenNext Cloudflare for local development
initOpenNextCloudflareForDev();

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // 这里可以添加将来需要的配置选项
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  serverExternalPackages: ['three', 'phaser'],
  webpack: (config, { isServer }) => {
    // Exclude heavy libraries from server bundles
    if (isServer) {
      config.externals = [...(config.externals || []), 'three', 'phaser'];
    }
    return config;
  },
};

export default withNextIntl(nextConfig);

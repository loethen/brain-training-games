import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // 配置图片
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // 将大型库标记为外部包（服务端不打包）
  serverExternalPackages: ['three', 'phaser'],

  webpack: (config, { isServer }) => {
    // 在服务端排除重型客户端库
    if (isServer) {
      config.externals = [...(config.externals || []), 'three', 'phaser'];
    }

    // 忽略大型依赖，减少bundle大小
    config.resolve.alias = {
      ...config.resolve.alias,
      // 这些库只在客户端使用
    };

    return config;
  },
};

export default withNextIntl(nextConfig);

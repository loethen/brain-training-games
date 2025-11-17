import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // 使用 standalone 输出模式减少函数大小
  output: 'standalone',

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

  // 排除大型库文件，减少函数体积
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        'node_modules/three/**/*',
        'node_modules/phaser/**/*',
        'node_modules/@types/three/**/*',
      ],
    },
  },

  webpack: (config, { isServer }) => {
    // 在服务端排除重型客户端库
    if (isServer) {
      config.externals = [...(config.externals || []), 'three', 'phaser'];
    }
    return config;
  },
};

export default withNextIntl(nextConfig);

/** @type {import('next').NextConfig} */

const nextConfig = {
  // 其他现有配置保持不变
  images: {
    domains: ['images.unsplash.com'],
  },
  
  // 优化构建输出
  output: 'standalone', // 使用独立输出模式，减少依赖
  
  // 优化构建过程
  experimental: {
    optimizePackageImports: ['@mui/icons-material', '@mui/material'],
    optimizeCss: true, // 优化CSS
    turbotrace: {
      // 追踪并优化依赖
      contextDirectory: __dirname,
    },
  },

  // 配置webpack以减小构建大小
  webpack: (config, { dev, isServer }) => {
    // 生产环境优化
    if (!dev) {
      // 优化CSS
      if (!isServer) {
        config.optimization.splitChunks.cacheGroups.styles = {
          name: 'styles',
          test: /\.(css|scss)$/,
          chunks: 'all',
          enforce: true,
        };
      }
    }

    return config;
  },
}

module.exports = nextConfig 
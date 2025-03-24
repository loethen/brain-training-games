import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // 这里可以添加将来需要的配置选项
  images: {
    domains: ['images.unsplash.com'],
  },
};

export default withNextIntl(nextConfig);

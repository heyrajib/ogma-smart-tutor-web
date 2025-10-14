import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
  images: {
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_BASE_PATH || '' : '',
  basePath: process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_BASE_PATH || '' : '',
};

export default nextConfig;

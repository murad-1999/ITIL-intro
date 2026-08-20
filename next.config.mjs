/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: isProd ? '/ITIL-intro' : '',
  experimental: {
    webpackBuildWorker: false
  },
  webpack: (config) => {
    config.cache = false;
    return config;
  }
};

export default nextConfig;


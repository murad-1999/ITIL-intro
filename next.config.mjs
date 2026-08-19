/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    webpackBuildWorker: false
  },
  webpack: (config) => {
    config.cache = false;
    return config;
  }
};

export default nextConfig;

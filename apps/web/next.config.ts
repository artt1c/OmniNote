import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@omninote/shared'],
  reactStrictMode: false,
};

export default nextConfig;
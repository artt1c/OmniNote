import { ZodFunction } from "zod";
(ZodFunction.prototype as any).implementAsync = ZodFunction.prototype.implement;

import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";
import path from "path";

const withSerwist = withSerwistInit({
  // Only generate and activate the service worker in production.
  // In dev mode the cached sw.js would intercept RSC/HMR requests causing loops.
  disable: process.env.NODE_ENV !== 'production',
  // Correct path: project uses the src/ directory layout
  swSrc: "src/app/sw.ts",
  // The compiled SW will be output here and served by Next.js automatically
  swDest: "public/sw.js",
});

const nextConfig: NextConfig = {
  transpilePackages: ['@omninote/shared'],
  reactStrictMode: false,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      yjs: path.resolve(__dirname, "node_modules/yjs"),
    };
    return config;
  },
};

export default withSerwist(nextConfig);
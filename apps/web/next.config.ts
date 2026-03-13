import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

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
};

export default withSerwist(nextConfig);
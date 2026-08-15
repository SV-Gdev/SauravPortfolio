import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // NOTE: "output: standalone" removed — Netlify plugin handles SSR/API routes
  // via Netlify Functions. Standalone mode is incompatible with @netlify/plugin-nextjs.
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;

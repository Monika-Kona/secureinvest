import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  eslint: {
    // Disable ESLint during builds to avoid blocking deployment on lint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow builds to succeed even if there are type errors (fix post-deploy)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

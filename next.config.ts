import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep file tracing inside this app instead of inferring a workspace root
  // from unrelated lockfiles above the project directory.
  outputFileTracingRoot: process.cwd(),
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "**",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "cdn.simpleicons.org",
      },
    ],
  },
};

export default nextConfig;

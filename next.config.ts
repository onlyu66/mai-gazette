import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  turbopack: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    root: process.cwd() as any,
  },
};

export default nextConfig;

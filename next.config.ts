import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // generates static HTML
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

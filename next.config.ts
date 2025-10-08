import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', 
  dynamicParams: true,// 👈 enables static HTML export
  images: {
    unoptimized: true, // required if you use next/image
  },
  trailingSlash: true, // optional, ensures correct routing in static hosting
  eslint: {
    ignoreDuringBuilds: true,
  },
};
export default nextConfig;

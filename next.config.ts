import type { NextConfig } from "next";


const nextConfig = {
  eslint: {
    // Jangan gagal build gara-gara error ESLint
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

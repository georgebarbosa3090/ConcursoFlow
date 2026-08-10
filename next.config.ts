import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ignorar erros de TypeScript durante o build da Vercel
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

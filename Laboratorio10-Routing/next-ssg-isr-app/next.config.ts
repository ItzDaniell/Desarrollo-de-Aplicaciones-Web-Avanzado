import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "rickandmortyapi.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/", 
        destination: "/pokemon", 
        permanent: true,    
      },
    ];
  },
};

export default nextConfig;
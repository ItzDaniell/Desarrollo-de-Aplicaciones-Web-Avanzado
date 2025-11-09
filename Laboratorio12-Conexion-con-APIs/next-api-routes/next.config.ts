import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: () => {
    return [
      {
        source: "/",
        destination: "/authors",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

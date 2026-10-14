import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.9", "192.168.*.*", "localhost:3000", "localhost:3001"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;

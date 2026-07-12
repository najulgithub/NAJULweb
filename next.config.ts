import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tsquhzreyivybihoumoe.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.najul.com.ar" }],
        destination: "https://najul.com.ar/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

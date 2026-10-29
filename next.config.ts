import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 sólo permite las calidades declaradas acá (antes valía cualquiera).
    // Las usa src/lib/imagen.ts: 40 miniatura, 70/72 fotos, 85 logo.
    qualities: [40, 70, 72, 85],
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

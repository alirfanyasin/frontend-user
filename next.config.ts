import type { NextConfig } from "next";

/** @type {NextConfig} */
const nextConfig: NextConfig = {
  // images: {
  //   // ✅ Tambahkan domain yang diizinkan
  // },
  images: {
    domains: ["ui-avatars.com"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "your-production-domain.com", // Replace with your production domain
        pathname: "/storage/**",
      },
    ],
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;

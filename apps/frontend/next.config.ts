import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/grafana/:path*",
        destination: "http://grafana:3000/grafana/:path*",
      },
      {
        source: "/grafana",
        destination: "http://grafana:3000/grafana",
      },
    ];
  },
};

export default nextConfig;

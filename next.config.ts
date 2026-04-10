import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    // Explicitly set environment variables
    TURSO_CONNECTION_URL: process.env.TURSO_CONNECTION_URL,
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
    NEXT_PUBLIC_GRAPHQL_API_URL:
      process.env.NEXT_PUBLIC_GRAPHQL_API_URL || "/api/graphql",
  },
  async rewrites() {
    return [
      {
        source: "/api/graphql",
        destination: "/api/graphql",
      },
    ];
  },
};

export default nextConfig;

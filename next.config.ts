import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/articles/[slug]": ["./content/articles/**/*"],
    "/": ["./content/articles/**/*"],
    "/topics": ["./content/articles/**/*"],
    "/topics/[cluster]": ["./content/articles/**/*"],
    "/articles": ["./content/articles/**/*"],
  },
};

export default nextConfig;

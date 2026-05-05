import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude server-only packages from client bundle
  serverExternalPackages: ["passkit-generator", "bcryptjs"],
};

export default nextConfig;

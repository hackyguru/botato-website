import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The repo root has its own lockfile for the Tauri app, so Next guesses
  // wrong about where this site begins unless it is told.
  turbopack: { root: path.resolve(".") },
};

export default nextConfig;

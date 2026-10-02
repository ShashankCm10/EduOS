/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow the sandbox preview proxy (and any host tunnel) to talk to the dev server.
  allowedDevOrigins: ['*.e2b.app', '*.arena.ai', 'localhost', '127.0.0.1'],
  devIndicators: false,
  eslint: { ignoreDuringBuilds: true },
  images: { unoptimized: true },
};

export default nextConfig;

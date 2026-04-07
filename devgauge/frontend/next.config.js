/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['avatars.githubusercontent.com', 'github.com'],
  },
  // Disable x-powered-by header
  poweredByHeader: false,
};
module.exports = nextConfig;

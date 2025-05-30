/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ This allows the build to complete even with ESLint errors
  },
};

export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        dns: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN, // Exposes for frontend
    VERCEL_URL: process.env.VERCEL_URL // Add this line
  },
};

module.exports = nextConfig;

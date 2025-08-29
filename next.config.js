/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverActions: { bodySizeLimit: '2mb' } },
  env: {
    NEXT_PUBLIC_ASSET_VERSION:
      process.env.VERCEL_GIT_COMMIT_SHA || `${Date.now()}`
  }
};
module.exports = nextConfig;

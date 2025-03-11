/** @type {import('next').NextConfig} */
export default {
  env: {
    BASE_DOMAIN:
      process.env.NODE_ENV === "production"
        ? process.env.VERCEL_PROJECT_PRODUCTION_URL
        : (process.env.VERCEL_URL ?? "localhost:3000"),
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // TODO: test this
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
};

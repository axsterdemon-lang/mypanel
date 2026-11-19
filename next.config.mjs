import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { imageHosts } from './image-hosts.config.mjs';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep Next.js and Turbopack anchored to this project when parent folders contain lockfiles.
  turbopack: {
    root: projectRoot,
  },
  outputFileTracingRoot: projectRoot,
  outputFileTracingExcludes: {
    '/*': ['./.payment-data/**/*', './.env*', './tests/**/*'],
  },
  async headers() {
    return [
      { source: '/api/payments/:path*', headers: [
        { key: 'Cache-Control', value: 'no-store' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
      ] },
      ...['/checkout', '/order-confirmation', '/admin/:path*'].map(source => ({ source, headers: [
        { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        { key: 'Referrer-Policy', value: 'no-referrer' },
      ] })),
    ];
  },
  productionBrowserSourceMaps: true,
  // Use a dedicated dev output folder so stale/OneDrive-locked .next files cannot block startup.
  distDir: process.env.DIST_DIR || '.next-dev',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: imageHosts,
    minimumCacheTTL: 60,
    qualities: [75, 85, 100],
  },
  webpack(
    config,
    {
      dev: dev
    }
  ) {
    if (dev) {
      config.module.rules.push({
        test: /\.(jsx|tsx)$/,
        exclude: [/node_modules/],
        use: [{
          loader: '@dhiwise/component-tagger/nextLoader',
        }],
      });
      const ignoredPaths = (process.env.WATCH_IGNORED_PATHS || '')
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);
      config.watchOptions = {
        ignored: ignoredPaths.length
          ? ignoredPaths.map((p) => `**/${p.replace(/^\/+|\/+$/g, '')}/**`)
          : undefined,
      };
    }
    return config;
  },
};

export default nextConfig;

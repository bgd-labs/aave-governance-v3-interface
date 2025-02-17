/** @type {import('next').NextConfig} */
const isForIPFS = process.env.NEXT_PUBLIC_DEPLOY_FOR_IPFS === 'true';
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  experimental: {
    webpackBuildWorker: true,
  },
  async headers() {
    return [
      {
        source: "/manifest.json",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-Requested-With, content-type, Authorization",
          },
          {
            key: "Content-Security-Policy",
            value: 'frame-ancestors "self" https://app.safe.global;',
          },
        ],
      },
    ];
  },
  webpack(config) {
    // config.resolve.fallback = { fs: false, path: false };

    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: /url/ }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    config.experiments = { topLevelAwait: true, layers: true };

    return config;
  },
  reactStrictMode: true,
  trailingSlash: true,
};

module.exports = withBundleAnalyzer(
  isForIPFS
    ? {
        ...nextConfig,
        output: 'export',
        images: {
          unoptimized: true,
        },
        // assetPrefix: './',
      }
    : {
        ...nextConfig,
        pageExtensions: [
          'page.tsx',
          'page.ts',
          'page.jsx',
          'page.js',
          'page.md',
          'page.mdx',
        ],
      },
);

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const pageExtensions =  ["page.tsx", "conf.tsx"];

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    webpackBuildWorker: true,
  },
  webpack(config) {
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
  pageExtensions,
};

module.exports = withBundleAnalyzer(
  process.env.NEXT_PUBLIC_DEPLOY_FOR_IPFS === 'true' ? { ...nextConfig, output: 'export' }
    : { ...nextConfig, pageExtensions: [...pageExtensions, "404.tsx", "api.ts"]},
);

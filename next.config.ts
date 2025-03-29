/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // Security improvement
  compress: true, // Enable compression
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
    dangerouslyAllowSVG: true, // Allow SVG for icons if needed
    minimumCacheTTL: 60 * 60 * 24 * 30, // Cache images for 30 days
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion', 'lucide-react'],
    scrollRestoration: true, // Improve scroll position preservation
    webVitalsAttribution: ['CLS', 'LCP'], // Track key metrics
  },
  transpilePackages: ['framer-motion'],
  webpack: (config: any) => {
    // Reduce bundle size
    config.optimization.moduleIds = 'deterministic';
    return config;
  },
};

export default nextConfig;

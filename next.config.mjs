/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false, // Ensures source maps are never exposed
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/**',
      },
    ],
  },

  async redirects() {
    return [
      {
        source: '/saqibmd',
        destination: '/bot',
        permanent: true,
      },
      {
        source: '/saqibbot',
        destination: '/bot',
        permanent: true,
      },
      {
        source: '/bot-md',
        destination: '/bot',
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; style-src-attr 'unsafe-inline'; img-src 'self' data: blob: https: https://ik.imagekit.io; font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.googleapis.com https://www.google-analytics.com https://analytics.google.com https://*.imagekit.io https://*.up.railway.app https://*.herokuapp.com; object-src 'none'; base-uri 'self'; frame-ancestors 'self' https://*.google.com https://*.run.app https://aistudio.google.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

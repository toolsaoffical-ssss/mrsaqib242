/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
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
            value: "default-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' https://fonts.googleapis.com 'sha256-dvy/zx3Lt8YA0e9q27genNTMLa1t+CR4JKar/XVu4K0=' 'sha256-IDh2k2l3z5Di2wzyZ+riushVqge3kUsuv28YXF0pXfk=' 'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='; style-src-elem 'self' https://fonts.googleapis.com 'sha256-dvy/zx3Lt8YA0e9q27genNTMLa1t+CR4JKar/XVu4K0=' 'sha256-IDh2k2l3z5Di2wzyZ+riushVqge3kUsuv28YXF0pXfk=' 'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='; style-src-attr 'unsafe-inline'; img-src 'self' data: blob: https: https://ik.imagekit.io; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.googleapis.com https://www.google-analytics.com https://analytics.google.com https://*.imagekit.io; object-src 'none'; base-uri 'self'; frame-ancestors 'none';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

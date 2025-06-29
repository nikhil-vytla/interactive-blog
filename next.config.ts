import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/interactive-blog',
  assetPrefix: '/interactive-blog/',
  images: {
    unoptimized: true
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://cdn.plot.ly",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https://cdn.jsdelivr.net https://pypi.org https://files.pythonhosted.org",
              "worker-src 'self' blob:",
              "child-src 'self' blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests"
            ].join('; ')
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Configure webpack for client-side builds
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        child_process: false,
        'fs/promises': false,
        url: false,
        vm: false,
        buffer: false,
        stream: false,
        util: false,
        os: false,
      };
      
      // Add external handling for node: prefixed modules
      config.externals = config.externals || [];
      config.externals.push(
        'pyodide/pyodide.asm.js',
        'pyodide/pyodide.asm.wasm',
        {
          'node:fs': 'empty',
          'node:path': 'empty',
          'node:crypto': 'empty',
          'node:child_process': 'empty',
          'node:fs/promises': 'empty',
          'node:url': 'empty',
          'node:vm': 'empty',
          'node:buffer': 'empty',
          'node:stream': 'empty',
          'node:util': 'empty',
          'node:os': 'empty',
        }
      );
    }
    
    return config;
  },
};

export default nextConfig;

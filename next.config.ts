import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/interactive-math-blog',
  assetPrefix: '/interactive-math-blog/',
  images: {
    unoptimized: true
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

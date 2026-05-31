/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
    serverComponentsExternalPackages: ['unpdf', 'mammoth'],
    optimizePackageImports: ['jose', 'bcryptjs'],
  },
};

export default nextConfig;

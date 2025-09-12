/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Jika menggunakan basePath, uncomment baris di bawah
  // basePath: '/your-base-path',
  
  // Disable server-side features untuk static export
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
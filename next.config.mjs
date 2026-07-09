/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/xirgmvgj/**', // Allows all paths under your Cloudinary account
      },
    ],
  },
};

export default nextConfig;
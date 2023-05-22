/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    dangerouslyAllowSVG: true,
    domains: ["tailwindui.com", "images.unsplash.com", "avatars.githubusercontent.com", "user-images.githubusercontent.com", "cdn.stocksnap.io"]
  }
}

module.exports = nextConfig

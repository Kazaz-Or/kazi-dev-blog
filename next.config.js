/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    dangerouslyAllowSVG: true,
    domains: ["res.cloudinary.com",
    "images.unsplash.com",
    "avatars.githubusercontent.com",
    "user-images.githubusercontent.com",
    "cdn.stocksnap.io",
    "media.dev.to"]
  }
}

module.exports = nextConfig

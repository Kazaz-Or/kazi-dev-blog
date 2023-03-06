/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    dangerouslyAllowSVG: true,
    domains: ["tailwindui.com", "images.unsplash.com", "thrangra.sirv.com", "avatars.githubusercontent.com"]
  }
}

module.exports = nextConfig

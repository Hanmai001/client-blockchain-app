/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  sassOptions: {
    prependData: `@import "./_mantine.scss";`,
  },
  experimental: {
    optimizePackageImports: [
      '@mantine/core',
      '@mantine/hooks'
    ],
  }
}

module.exports = nextConfig

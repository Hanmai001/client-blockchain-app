/** @type {import('next').NextConfig} */
const nextConfig = {
  // webpack5: true,
  // webpack: (config) => {
  //   config.resolve.fallback = { fs: false };

  //   return config;
  // },
  publicRuntimeConfig: {
    ENV: process.env["ENV"] || "PRODUCTION",
    PUBLIC_URL: process.env["PUBLIC_URL"],
    URL_MAIN_API: process.env["URL_MAIN_API"],
    URL_CROSS_STORAGE: process.env["URL_CROSS_STORAGE"],
    SOCKET_ENDPOINT: process.env["SOCKET_ENDPOINT"]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
  sassOptions: {
    prependData: `@import "./_mantine.scss";`,
  },
  experimental: {
    optimizePackageImports: [
      '@mantine/core',
      '@mantine/hooks',
      '@mantine/dropzone'
    ],
  }
}

module.exports = nextConfig
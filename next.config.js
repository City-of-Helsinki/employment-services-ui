const { i18n } = require('./next-i18next.config')

const publicRuntimeConfig = {
  NEXT_PUBLIC_DRUPAL_BASE_URL: process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,
}

const serverRuntimeConfig = {
  REVALIDATE_TIME: 20, //seconds
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,
  reactStrictMode: true,
  publicRuntimeConfig,
  serverRuntimeConfig,
  images: {
    domains: [process.env.NEXT_IMAGE_DOMAIN],
  }
}

module.exports = nextConfig

const { i18n } = require('./next-i18next.config')

const publicRuntimeConfig = {
  NEXT_PUBLIC_DRUPAL_BASE_URL: process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,
  NEXT_PUBLIC_DRUPAL_EDIT_URL: process.env.NEXT_PUBLIC_DRUPAL_EDIT_URL,
  NEXT_IMAGE_DOMAIN: process.env.NEXT_IMAGE_DOMAIN,
  MATOMO_SITE_ID: process.env.MATOMO_SITE_ID,
  MATOMO_URL: process.env.MATOMO_URL,
  REACT_AND_SHARE_FI: process.env.REACT_AND_SHARE_FI,
  REACT_AND_SHARE_SV: process.env.REACT_AND_SHARE_SV,
  REACT_AND_SHARE_EN: process.env.REACT_AND_SHARE_EN,
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN
}

const serverRuntimeConfig = {
  REVALIDATE_TIME: 60, //seconds
  BUILD_PHASE: process.env.BUILD_PHASE || false,
  ELASTICSEARCH_URL: process.env.ELASTICSEARCH_URL,
  elasticsearch_password: process.env.elasticsearch_password,
  elasticsearch_certificate: process.env.elasticsearch_certificate,
  NEXT_PUBLIC_DRUPAL_BASE_URL: process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,
  NEXT_PUBLIC_DRUPAL_EDIT_URL: process.env.NEXT_PUBLIC_DRUPAL_EDIT_URL,
  DRUPAL_FRONT_PAGE: process.env.DRUPAL_FRONT_PAGE,
  DRUPAL_CLIENT_ID: process.env.DRUPAL_CLIENT_ID,
  DRUPAL_CLIENT_SECRET: process.env.DRUPAL_CLIENT_SECRET,
  DRUPAL_PREVIEW_SECRET: process.env.DRUPAL_PREVIEW_SECRET,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_INSTANCE: process.env.REDIS_INSTANCE,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PREFIX: process.env.REDIS_PREFIX
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,
  reactStrictMode: true,
  publicRuntimeConfig,
  serverRuntimeConfig,
  images: {
    domains: [process.env.NEXT_IMAGE_DOMAIN, 'api.hel.fi'],
    deviceSizes: [576, 768, 992, 1200]
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        destination: 'https://www.hel.fi/fi/yritykset-ja-tyo/tyonhakijat',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig

import getConfig from 'next/config'
import { DrupalClient } from 'next-drupal'

export const getDrupalClient = (withAuth: boolean = false) => {
  const { NEXT_PUBLIC_DRUPAL_BASE_URL, DRUPAL_PREVIEW_SECRET, DRUPAL_CLIENT_ID, DRUPAL_CLIENT_SECRET } = getConfig().serverRuntimeConfig
  return new DrupalClient(
    NEXT_PUBLIC_DRUPAL_BASE_URL,
    {
      auth: {
        clientId: DRUPAL_CLIENT_ID,
        clientSecret: DRUPAL_CLIENT_SECRET
      },
      previewSecret: DRUPAL_PREVIEW_SECRET,
      // Make preview work in development environment.
      forceIframeSameSiteCookie: process.env.NODE_ENV === "development",
      ...(withAuth && { withAuth: true })
    }
  )
}

import {
  GetStaticPropsContext,
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsResult,
} from 'next'
import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import getConfig from 'next/config'
import { Locale } from 'next-drupal'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

import getMenu from '@/lib/get-menu'
import { getDrupalClient } from '@/lib/drupal-client'
import { Node, NavProps, FooterProps } from '@/lib/types'
import { NODE_TYPES } from '@/lib/drupalApiTypes'
import { getNode } from '@/lib/ssr-api'
import {
  getBreadCrumb,
  getDefaultImage,
  getDescription,
  getLanguageLinks,
  getPathAlias,
  getTitle,
} from '@/lib/helpers'
import { useConsentStatus, useReactAndShare } from '@/hooks/useAnalytics'
import CampaignPageMapper from '@/components/pageMappers/CampaignPageMapper'
import PageMapper from '@/components/pageMappers/PageMapper'

interface PageProps {
  node: Node
  nav: NavProps
  footer: FooterProps
}

export async function getStaticPaths(
  context: GetStaticPathsContext
): Promise<GetStaticPathsResult> {
  const drupal = getDrupalClient()
  let types = Object.values(NODE_TYPES)

  // Don't prebuild drupal nodes in staging.
  if (
    process.env.NEXT_PUBLIC_DRUPAL_BASE_URL ===
    'https://tyollisyyspalvelut-edit.stage.hel.ninja'
  ) {
    types = []
  }

  const paths = await drupal.getStaticPathsFromContext(types, context)

  return {
    paths: paths,
    fallback: true,
  }
}

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<PageProps>> {
  const {REVALIDATE_TIME, BUILD_PHASE} = getConfig().serverRuntimeConfig
  const {locale, defaultLocale} = context as {
    locale: Locale
    defaultLocale: Locale
  }
  let withAuth = false

  // Use auth with preview to see unpublished content.
  if (context.preview) {
    withAuth = true
  }

  const drupal = getDrupalClient(withAuth)

  const path = await drupal.translatePathFromContext(context)
  const type = path?.jsonapi?.resourceName

  if (!type) {
    return {
      notFound: true,
      revalidate: 3,
    }
  }

  const entityLangcode = path?.entity?.langcode
  // If page(path) doesn't exist on current language.
  if (locale !== entityLangcode) {
    return {
      notFound: true,
      revalidate: 3,
    }
  }

  let node: any = {}

  if (BUILD_PHASE) {
    // Try a few times, sometimes Drupal router just gives random errors.
    node = await getNode({type, context, drupal, path, retry: 5})
  } else {
    node = await getNode({type, context, drupal, path})
  }

  // Return 404 if node was null
  if (!node || node?.notFound || (!context.preview && node?.status === false)) {
    return {
      notFound: true,
      revalidate: 3,
    }
  }

  const langLinks = await getLanguageLinks(node)

  const {tree: menu, items: menuItems} = await getMenu(
    'main',
    locale,
    defaultLocale
  )
  const {tree: themes} = await getMenu(
    'additional-languages',
    locale,
    defaultLocale
  )
  const {tree: footerNav} = await getMenu('footer', locale, defaultLocale)

  const breadcrumb = getBreadCrumb(
    menuItems,
    getPathAlias(node?.path),
    node?.title,
    node?.type
  )

  return {
    props: {
      node,
      nav: {
        locale,
        menu,
        themes,
        langLinks,
        breadcrumb,
      },
      footer: {
        locale,
        footerNav,
      },
      ...(await serverSideTranslations(locale, ['common'])),
    },
    revalidate: REVALIDATE_TIME,
  }
}

export default function Page({node, nav, footer}: PageProps) {
  const router = useRouter()
  const {t} = useTranslation('common')
  const rnsStatus: boolean = useConsentStatus('rns')
  useReactAndShare(
    rnsStatus,
    router.locale,
    node && getTitle(node, t('site_title'))
  )

  if (!router.isFallback && !node?.id) {
    return <ErrorPage statusCode={404} />
  }

  if (!node) return null

  const metaTitle = getTitle(node, t('site_title'))
  const metaDescription = getDescription(node)
  const metaUrl = process.env.NEXT_PUBLIC_SITE_URL + router.asPath
  const metaImage = getDefaultImage(node)

  if (node.field_hide_navigation === true) {
    return (
      <CampaignPageMapper
        node={node}
        footer={footer}
        metaDescription={metaDescription}
        metaTitle={metaTitle}
        metaUrl={metaUrl}
        metaImage={metaImage}
        rnsStatus={rnsStatus}
      />
    )
  } else {
    return (
      <PageMapper
        node={node}
        nav={nav}
        footer={footer}
        metaDescription={metaDescription}
        metaTitle={metaTitle}
        metaUrl={metaUrl}
        metaImage={metaImage}
        rnsStatus={rnsStatus}
      />
    )
  }
}

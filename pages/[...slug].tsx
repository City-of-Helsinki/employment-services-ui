import { useRouter } from 'next/router'
import Head from 'next/head'
import ErrorPage from 'next/error'
import { GetStaticPropsContext, GetStaticPathsContext, GetStaticPathsResult, GetStaticPropsResult } from 'next'
import getConfig from 'next/config'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Locale } from "next-drupal"
import { useTranslation } from 'next-i18next'
import { Container } from 'hds-react'

import NodeBasicPage from '@/components/pageTemplates/NodeBasicPage'
import NodeLandingPage from '@/components/pageTemplates/NodeLandingPage'
import NodeEventPage from '@/components/pageTemplates/NodeEventPage'
import NodeArticlePage from '@/components/pageTemplates/NodeArticlePage'
import NodeTprUnitPage from '@/components/pageTemplates/NodeTprUnitPage'
import { Layout } from '@/components/layout/Layout'

import { getDrupalClient } from '@/lib/drupal-client'
import getMenu from '@/lib/get-menu'
import { Node } from '@/lib/types'
import { NODE_TYPES } from '@/lib/drupalApiTypes'
import { getQueryParamsFor } from '@/lib/params'
import { NavProps, FooterProps } from '@/lib/types'
import { getBreadCrumb, getDefaultImage, getDescription, getLanguageLinks, getPathAlias, getTitle } from '@/lib/helpers'
import { useConsentStatus, useReactAndShare } from '@/hooks/useAnalytics'
import ConsentInfo from '@/components/consentInfo/ConsentInfo'

interface PageProps {
  node: Node
  nav: NavProps
  footer: FooterProps
}

export async function getStaticPaths(context: GetStaticPathsContext): Promise<GetStaticPathsResult> {
  const drupal = getDrupalClient()
  let types = Object.values(NODE_TYPES)

  // Don't prebuild drupal nodes in staging.
  if (process.env.NEXT_PUBLIC_DRUPAL_BASE_URL === 'https://tyollisyyspalvelut-edit.stage.hel.ninja') {
    types = []
  }

  const paths = await drupal.getStaticPathsFromContext(types, context)

  return {
    paths: paths,
    fallback: true
  }
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<PageProps>> {
  const { locale, defaultLocale } = context as { locale: Locale, defaultLocale: Locale }
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
      revalidate: 3
    }
  }

  const entityLangcode = path?.entity?.langcode
  // If page(path) doesn't exist on current language.
  if (locale !== entityLangcode) {
    return {
      notFound: true,
      revalidate: 3
    }
  }

  const node = await drupal.getResourceFromContext<Node>(type, context, {
    params: getQueryParamsFor(type),
  })

  // Return 404 if node was null
  if (!node || node?.notFound || (!context.preview && node?.status === false)) {
    return {
      notFound: true,
      revalidate: 3
    }
  }

  const langLinks = await getLanguageLinks(node)

  const { tree: menu, items: menuItems } = await getMenu('main', locale, defaultLocale)
  const { tree: themes } = await getMenu('additional-languages', locale, defaultLocale)
  const { tree: footerNav } = await getMenu('footer', locale, defaultLocale)

  const breadcrumb = getBreadCrumb(menuItems, getPathAlias(node?.path), node?.title, node?.type)

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
    }
  }
}

export default function Page({ node, nav, footer }: PageProps) {
  const router = useRouter()
  const { t } = useTranslation('common')
  const rnsStatus: boolean = useConsentStatus('rns')
  useReactAndShare(rnsStatus, router.locale, node && getTitle(node, t('site_title')))

  if (!router.isFallback && !node?.id) {
    return <ErrorPage statusCode={404} />
  }

  if (!node) return null

  const metaTitle = getTitle(node, t('site_title'))
  const metaDescription = getDescription(node)
  const metaUrl = process.env.NEXT_PUBLIC_SITE_URL + router.asPath
  const metaImage = getDefaultImage(node)

  return (
    <Layout header={nav} footer={footer}>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={metaUrl} />
        <meta property="og:image" content={metaImage} />
      </Head>
      { node.type === NODE_TYPES.PAGE && (
        <NodeBasicPage node={node} sidebar={nav} />
      )}
      { node.type === NODE_TYPES.LANDING_PAGE && (
        <NodeLandingPage node={node} />
      )}
      { node.type === NODE_TYPES.EVENT && (
        <NodeEventPage node={node} />
      )}
      { node.type === NODE_TYPES.ARTICLE && (
        <NodeArticlePage node={node} />
      )}
      { node.type === NODE_TYPES.TPR_UNIT && (
        <NodeTprUnitPage node={node} sidebar={nav} />
      )}
      {/* React and share */}
      <Container className="container">
        <div className="rns">
          {rnsStatus !== true ? <ConsentInfo /> : ''}
        </div>
      </Container>
    </Layout>
  )
}

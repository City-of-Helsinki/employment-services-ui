import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { Locale } from 'next-drupal'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { Container } from 'hds-react'

import { getDrupalClient } from '@/lib/drupal-client'
import getMenu from '@/lib/get-menu'
import { NODE_TYPES } from '@/lib/drupalApiTypes'
import { Layout } from '@/components/layout/Layout'
import NodeLandingPage from '@/components/pageTemplates/NodeLandingPage'
import { Node, NavProps, FooterProps } from '@/lib/types'
import { getQueryParamsFor } from '@/lib/params'
import { getDefaultImage, getDescription, getTitle } from '@/lib/helpers';
import { useConsentStatus, useReactAndShare } from '@/hooks/useAnalytics'
import ConsentInfo from '@/components/consentInfo/ConsentInfo'


interface HomePageProps {
  node: Node
  nav: NavProps
  footer: FooterProps
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<HomePageProps>> {
  const { locale, defaultLocale } = context as { locale: Locale, defaultLocale: Locale }
  const { DRUPAL_FRONT_PAGE } = getConfig().serverRuntimeConfig  
  const drupal = getDrupalClient()

  const node = await drupal.getResourceByPath<Node>(DRUPAL_FRONT_PAGE, {
    locale,
    defaultLocale,
    params: getQueryParamsFor(NODE_TYPES.LANDING_PAGE)
  })

  if (!node || (!context.preview && node?.status === false)) {
    return {
      notFound: true,
      revalidate: 3
    }
  }

  const langLinks = { fi: '/', en: '/en', sv: '/sv'}
  const { tree: menu } = await getMenu('main', locale, defaultLocale)
  const { tree: themes } = await getMenu('additional-languages', locale, defaultLocale)
  const { tree: footerNav } = await getMenu('footer', locale, defaultLocale)

  return {
    props: {
      node,
      nav: {
        locale,
        menu,
        themes,
        langLinks,
      },
      footer: {
        locale,
        footerNav,
      },
      ...(await serverSideTranslations(locale, ['common'])),
    }
  }
}

export default function HomePage({ node, nav, footer }: HomePageProps) {
  const router = useRouter()
  const { t } = useTranslation('common')
  const rnsStatus = useConsentStatus('rns')
  useReactAndShare(rnsStatus, router.locale, node && getTitle(node, t('site_title')))

  if (!router.isFallback && !node?.id) {
    return <ErrorPage statusCode={404} />
  }

  if (!node) return null

  const metaTitle = getTitle(node, t('site_title'))
  const metaDescription = getDescription(node)
  const metaUrl = process.env.NEXT_PUBLIC_SITE_URL
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
      <NodeLandingPage node={node} />
      {/* React and share */}
      <Container className="container">      
        <div className="rns">
          {rnsStatus !== true ? <ConsentInfo /> : ''}
        </div>
      </Container>
    </Layout>
  )
}

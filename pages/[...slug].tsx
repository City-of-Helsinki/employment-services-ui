import { useRouter } from 'next/router'
import Head from 'next/head'
import ErrorPage from 'next/error'
import { GetStaticPropsContext, GetStaticPathsContext, GetStaticPathsResult, GetStaticPropsResult } from 'next'
import getConfig from 'next/config'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import {
  Locale,
  getPathsFromContext,
  getResourceFromContext,
  getResourceTypeFromContext,
  getMenu,
} from "next-drupal"

import NodeBasicPage from '@/components/pageTemplates/NodeBasicPage'
import NodeLandingPage from '@/components/pageTemplates/NodeLandingPage'
import { Layout } from '@/components/layout/Layout'

import { Node } from '@/lib/types'
import { NODE_TYPES } from '@/lib/drupalApiTypes'
import { getQueryParamsFor } from '@/lib/params'
import { NavProps } from "@/lib/types"
import { getLanguageLinks } from '@/lib/helpers'

interface PageProps {
  node: Node
  nav: NavProps,
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<PageProps>> {
  const { REVALIDATE_TIME } = getConfig().serverRuntimeConfig
  const { locale, defaultLocale } = context as { locale: Locale, defaultLocale: Locale }

  const type = await getResourceTypeFromContext(context)

  if (!type) {
    return {
      notFound: true,
      revalidate: 3
    }
  }

  const node = await getResourceFromContext<Node>(type, context, {
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

  const { tree: menu } = await getMenu("main", {locale, defaultLocale})
  const { tree: themes } = await getMenu("additional-languages")

  console.log('menu', menu)

  return {
    props: {
      node,
      nav: {
        locale,
        menu,
        themes,
        langLinks,
      },
      ...(await serverSideTranslations(locale, ['common'])),
    },
    revalidate: REVALIDATE_TIME
  }
}

export async function getStaticPaths(context: GetStaticPathsContext): Promise<GetStaticPathsResult> {
  const types = Object.values(NODE_TYPES)
  const paths = await getPathsFromContext(types, context)

  return {
    paths: paths,
    fallback: true
  }
}

export default function Page({ node, nav }: PageProps) {
  const router = useRouter()
  if (!router.isFallback && !node?.id) {
    return <ErrorPage statusCode={404} />
  }

  if (!node) return null

  return (
    <Layout header={nav}>
      <Head>
        <title>{node.title}</title>
        <meta name="description" content="A Next.js site powered by a Drupal backend."
        />
      </Head>
      { node.type === NODE_TYPES.PAGE && (
        <NodeBasicPage node={node} sidebar={nav} />
      )}
      { node.type === NODE_TYPES.LANDING_PAGE && (
        <NodeLandingPage node={node} />
      )}
    </Layout>
  )
}

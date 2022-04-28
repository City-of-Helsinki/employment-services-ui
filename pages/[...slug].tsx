import { useRouter } from 'next/router'
import Head from 'next/head'
import ErrorPage from 'next/error'
import { GetStaticPropsContext, GetStaticPathsContext, GetStaticPathsResult, GetStaticPropsResult } from 'next'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { i18n } from 'next-i18next.config'

import {
  Locale,
  DrupalParagraph,
  getPathsFromContext,
  getResourceFromContext,
  getResourceTypeFromContext,
  getMenu,
  getResource,
} from "next-drupal"

import NodeBasicPage from '@/components/pageTemplates/NodeBasicPage'
import { Layout } from '@/components/layout/Layout'

import { NODE_TYPES, CONTENT_TYPES } from 'src/lib/drupalApiTypes'
import { Node } from 'src/lib/types'
import { getParams } from 'src/lib/params'
import { HeaderProps } from "src/lib/types"
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

interface PageProps {
  node: Node
  header: HeaderProps,
}

export default function Page({ node, header }: PageProps) {
  const router = useRouter()
  if (!router.isFallback && !node?.id) {
    return <ErrorPage statusCode={404} />
  }

  if (!node) return null

  return (
    <Layout header={header}>
      <Head>
        <title>{node.title}</title>
        <meta name="description" content="A Next.js site powered by a Drupal backend."
        />
      </Head>
      { node.type === "node--page" && (
        <NodeBasicPage node={node} />
      )}
    </Layout>
  )
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<PageProps>> {

  console.log('props context', context)

  const { locale, defaultLocale } = context as { locale: Locale, defaultLocale: Locale }

  const type = await getResourceTypeFromContext(context)

  if (!type) {
    return {
      notFound: true,
    }
  }

  const node = await getResourceFromContext<Node>(type, context, {
    params: getParams(type),
  })

  if (!node || (!context.preview && node?.status === false)) {
      return {
        notFound: true,
      }
  }

  const langLinks = await getLanguageLinks(node);

  const { tree: menu } = await getMenu("main", {locale, defaultLocale})
  const { tree: themes } = await getMenu("themes")

  return {
    props: {
      node,
      header: {
        locale,
        menu,
        themes,
        langLinks,
      },
      ...(await serverSideTranslations(locale, ['common'])),
    },
    // revalidate: 30,
  }
}

async function getLanguageLinks(node: DrupalNode): Promise<Object> {
  let params = new DrupalJsonApiParams().addFields(node.type, ['path']).getQueryObject()
  const uuid = node.id

  let langLinks = {};
  for (let locale of i18n.locales) {
    let prefix = locale !== i18n.defaultLocale ? `/${locale}` : ''
    let link = ''
    if(locale === node.langcode) {
      link = `${prefix}${node?.path.alias}` // current page link
    } else {
      // this has the original alias if not translated
      const response = await getResource(node.type, uuid, {params, locale, defaultLocale: i18n.defaultLocale})
      link = `${prefix}${response?.path.alias}`
    }
    Object.assign(langLinks, {[locale]: link})
  }

  return langLinks
}

export async function getStaticPaths(context: GetStaticPathsContext): Promise<GetStaticPathsResult> {

  const types = Object.values(NODE_TYPES)

  const paths = await getPathsFromContext(types, context)

  return {
    paths: paths,
    fallback: false,
  }
}

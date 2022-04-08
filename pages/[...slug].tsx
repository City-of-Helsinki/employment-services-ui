import { useRouter } from 'next/router'
import Head from 'next/head'
import ErrorPage from 'next/error'

import { GetStaticPropsContext, GetStaticPathsContext, GetStaticPathsResult, GetStaticPropsResult } from 'next'

import {
  Locale,
  DrupalParagraph,
  getPathsFromContext,
  getResource,
  getResourceFromContext,
  getResourceTypeFromContext,
  getMenu,
  DrupalMenuLinkContent,
  JsonApiWithLocaleOptions,
} from "next-drupal"

import NodeBasicPage from '@/components/pageTemplates/NodeBasicPage'
import { Layout } from '@/components/layout/Layout'

import { NODE_TYPES, CONTENT_TYPES } from 'src/lib/drupalApiTypes'
import { Node } from 'src/lib/types'
import { getParams } from 'src/lib/params'
interface PageProps {
  node: Node
  menu: DrupalMenuLinkContent[],
}

export default function Page({ node, menu }: PageProps) {
  const router = useRouter()
  if (!router.isFallback && !node?.id) {
    return <ErrorPage statusCode={404} />
  }

  if (!node) return null

  return (
    <Layout menu={menu}>
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

  const { tree } = await getMenu("main", {locale, defaultLocale})

  return {
    props: {
      node,
      menu: tree,
    },
    // revalidate: 30,
  }
}


export async function getStaticPaths(context: GetStaticPathsContext): Promise<GetStaticPathsResult> {

  const types = Object.values(NODE_TYPES)

  const paths = await getPathsFromContext(types, context)
  return {
    paths: paths,
    fallback: true,
  }
}

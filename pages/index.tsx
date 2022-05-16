import Head from "next/head"
import { GetStaticPropsContext, GetStaticPropsResult } from "next"
import { DrupalNode, Locale, getMenu, getResourceTypeFromContext, getResourceFromContext } from "next-drupal"
import getConfig from 'next/config'

import { Layout } from "@/components/layout/Layout"
import { Node, HeaderProps } from "@/lib/types";
import { getLanguageLinks } from "@/lib/helpers";
import { getQueryParamsFor } from "@/lib/params";

interface HomePageProps {
  node: DrupalNode;
  nav: HeaderProps;
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<HomePageProps>> {
  const { locale, defaultLocale } = context as { locale: Locale, defaultLocale: Locale }
  const { REVALIDATE_TIME } = getConfig().serverRuntimeConfig

  const type = await getResourceTypeFromContext(context)

  if (!type) {
    return {
      notFound: true,
    }
  }

  const node = await getResourceFromContext<Node>(type, context, {
    params: getQueryParamsFor(type),
  })

  if (!node || (!context.preview && node?.status === false)) {
    console.log(node)
    return {
      notFound: true,
    }
  }

  const langLinks = await getLanguageLinks(node);

  const { tree: menu } = await getMenu("main", {locale, defaultLocale})
  const { tree: themes } = await getMenu("additional-languages")

  return {
    props: {
      node,
      nav: {
        locale,
        menu,
        themes,
        langLinks,
      },
    },
    revalidate: REVALIDATE_TIME
  }
}

export default function HomePage({ node, nav }: HomePageProps) {
  return (
    <Layout header={nav}>
      <Head>
        <title>Next.js for Drupal</title>
      </Head>
      <div>
        {node ? (
            <div key={node.id}>
              <h1>{node.title}</h1>
            </div>
        ) : (
          <p>No landing page found</p>
        )}
      </div>
    </Layout>
  )
}

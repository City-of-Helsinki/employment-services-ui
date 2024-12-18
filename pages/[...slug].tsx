import { useRouter } from 'next/router'
import Head from 'next/head'
import ErrorPage from 'next/error'
import { GetStaticPropsContext, GetStaticPathsContext, GetStaticPathsResult, GetStaticPropsResult } from 'next'
import getConfig from 'next/config'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { DrupalNode, Locale } from 'next-drupal'
import { useTranslation } from 'next-i18next'
import { Container } from 'hds-react'
import dynamic from 'next/dynamic'

import NodeBasicPage from '@/components/pageTemplates/NodeBasicPage'
import NodeLandingPage from '@/components/pageTemplates/NodeLandingPage'
import NodeEventPage from '@/components/pageTemplates/NodeEventPage'
import NodeArticlePage from '@/components/pageTemplates/NodeArticlePage'
import NodeTprUnitPage from '@/components/pageTemplates/NodeTprUnitPage'
import { Layout } from '@/components/layout/Layout'

import { getDrupalClient } from '@/lib/drupal-client'
import getMenu from '@/lib/get-menu'
import { Node, NavProps, FooterProps } from '@/lib/types'
import { NODE_TYPES } from '@/lib/drupalApiTypes'
import { getNode } from '@/lib/ssr-api'
import { getBreadCrumb, getDefaultImage, getDescription, getPathAlias, getTitle, primaryLanguages } from '@/lib/helpers'
import { useConsentStatus, useReactAndShare } from '@/hooks/useAnalytics'
import { i18n } from '@/next-i18next.config'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'


interface PageProps {
  node: Node;
  nav: NavProps;
  footer: FooterProps;
  preview: boolean | undefined;
}

export async function getStaticPaths(context: GetStaticPathsContext): Promise<GetStaticPathsResult> {
  const drupal = getDrupalClient()
  let types = Object.values(NODE_TYPES)

  // Don't prebuild drupal nodes in staging.
  if (process.env.NEXT_PUBLIC_DRUPAL_BASE_URL === 'https://tyollisyyspalvelut-edit.stage.hel.ninja') {
    types = []
  }

  const paths = await drupal.getStaticPathsFromContext(types, context);

  return {
    paths: paths,
    fallback: true,
  };
}

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<PageProps>> {
  const { REVALIDATE_TIME, BUILD_PHASE } = getConfig().serverRuntimeConfig;
  const { locale, defaultLocale } = context as {
    locale: Locale;
    defaultLocale: Locale;
  };
  let withAuth = false;

  // Use auth with preview to see unpublished content.
  if (context.preview) {
    withAuth = true;
  }

  const drupal = getDrupalClient(withAuth);

  const path = await drupal.translatePathFromContext(context);
  const type = path?.jsonapi?.resourceName;

  if (!type) {
    return {
      notFound: true,
      revalidate: 3,
    };
  }

  const entityLangcode = path?.entity?.langcode;

  // If page(path) doesn't exist on current language.
  if (locale !== entityLangcode) {
    return {
      notFound: true,
      revalidate: 3,
    };
  }

  let node: any = {};

  if (BUILD_PHASE) {
    // Try a few times, sometimes Drupal router just gives random errors.
    node = await getNode({ type, context, drupal, path, retry: 5 });
  } else {
    node = await getNode({ type, context, drupal, path });
  }

  // Return 404 if node was null
  if (!node || node?.notFound || (!context.preview && node?.status === false)) {
    return {
      notFound: true,
      revalidate: 3,
    };
  }

  async function getLanguageLinks(node: DrupalNode): Promise<Object> {
    let params = new DrupalJsonApiParams()
      .addFields(node.type, ['path'])
      .getQueryObject();
    const uuid = node.id;

    let langLinks = {};
    for (let locale of i18n.locales) {
      let prefix = locale !== i18n.defaultLocale ? `/${locale}` : '';
      let link = '';
      if (locale === node.langcode) {
        link = `${prefix}${node?.path.alias}`; // current page link
      } else {
        // this has the original alias if not translated
        const response = await drupal.getResource(node.type, uuid, {
          params,
          locale,
          defaultLocale: i18n.defaultLocale,
        });
            link = `${prefix}${response?.path.alias}`;
      }
      Object.assign(langLinks, { [locale]: link });
    }

    return langLinks;
  }

  const langLinks = await getLanguageLinks(node);

  const getMainMenu = () => {
    if (primaryLanguages.includes(locale)) {
      return 'main'
    } else {
      return 'menu-other-languages';
    }
  }

  const { tree: menu, items: menuItems } = await getMenu(
    getMainMenu(),
    locale,
    defaultLocale
  );

  const { tree: themes } = await getMenu(
    'additional-languages',
    'en',
    defaultLocale,
  );

  const { tree: menuOtherLanguages } = await drupal.getMenu('menu-other-languages');

  const getFooterMenu = () => {
    if (primaryLanguages.includes(locale)) {
      return 'footer'
    } else {
      return 'footer-other-languages';
    }
  }
  const getFooterMenuLang = () => {
    if (primaryLanguages.includes(locale)) {
      return locale;
    } else {
      return 'en';
    }
  }

  const { tree: footerNav } = await getMenu(getFooterMenu(), getFooterMenuLang(), defaultLocale);

  const preview = context.preview ? context.preview : false;

  const breadcrumb = getBreadCrumb(
    menuItems,
    getPathAlias(node?.path),
    node?.title,
    node?.type,
    locale
  );

  return {
    props: {
      node,
      preview,
      nav: {
        locale,
        menu,
        themes,
        langLinks,
        breadcrumb,
        menuOtherLanguages,
      },
      footer: {
        locale,
        footerNav,
      },
      ...(await serverSideTranslations(locale, ['common'])),
    },
    revalidate: REVALIDATE_TIME,
  };
}

export default function Page({ node, nav, footer, preview }: PageProps) {
  const ConsentInfo = dynamic(() => import('../src/components/consentInfo/ConsentInfo'));
  const router = useRouter();
  const { t } = useTranslation('common');
  const rnsStatus: boolean = useConsentStatus('rns');
  useReactAndShare(
    rnsStatus,
    router.locale,
    node && getTitle(node, t('site_title'))
  );

  if (!router.isFallback && !node?.id) {
    return <ErrorPage statusCode={404} />;
  }

  if (!node) return null;

  const metaTitle = getTitle(node, t('site_title'));
  const metaDescription = getDescription(node);
  const metaUrl = process.env.NEXT_PUBLIC_SITE_URL + router.asPath;
  const metaImage = getDefaultImage(node);

  return (
    <Layout
      header={nav}
      footer={footer}
      hideNav={node.field_hide_navigation}
      langcode={node.langcode}
      preview={preview}
    >
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={metaUrl} />
        <meta property="og:image" content={metaImage} />
      </Head>
      <a id="content" tabIndex={-1}></a>
      { node.type === NODE_TYPES.PAGE && (
        <NodeBasicPage node={node} sidebar={nav} preview={preview}/>
      )}
      {node.type === NODE_TYPES.LANDING_PAGE && (
        <NodeLandingPage node={node} />
      )}
      {node.type === NODE_TYPES.EVENT && <NodeEventPage node={node} />}
      {node.type === NODE_TYPES.ARTICLE && <NodeArticlePage node={node} />}
      {node.type === NODE_TYPES.TPR_UNIT && (
        <NodeTprUnitPage node={node} sidebar={nav} preview={preview}/>
      )}
      {/* React and share */}
      <Container className="container hide-print">
        <div className="rns">{rnsStatus !== true ? <ConsentInfo /> : ''}</div>
      </Container>
    </Layout>
  );
}

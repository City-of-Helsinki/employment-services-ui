import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { Locale } from 'next-drupal'
import getConfig from 'next/config'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { CookiePage, Container } from 'hds-react'

import { Layout } from '@/components/layout/Layout'
import { NavProps, FooterProps } from '@/lib/types'

import { useCookieConsents } from '@/hooks/useAnalytics';
import { getDrupalClient } from '@/lib/drupal-client';
import { primaryLanguages } from '@/lib/helpers';

interface CookiePageProps {
  nav: NavProps
  footer: FooterProps
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<CookiePageProps>> {
  const drupal = getDrupalClient();
  const { locale, defaultLocale } = context as { locale: Locale, defaultLocale: Locale }
  const { REVALIDATE_TIME } = getConfig().serverRuntimeConfig 
  const langLinks = { fi: '/cookies', en: '/en/cookies', sv: '/sv/cookies' };
  const { tree: menu } = await drupal.getMenu('main', {
    locale: locale,
    defaultLocale: defaultLocale,
  });
  const { tree: themes } = await drupal.getMenu('additional-languages', {
    locale: locale,
    defaultLocale: defaultLocale,
  });

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

  const { tree: footerNav } = await drupal.getMenu(getFooterMenu(), {
    locale: getFooterMenuLang(),
    defaultLocale: defaultLocale,
  });

  return {
    props: {
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
    },
    revalidate: REVALIDATE_TIME
  }
}

export default function Cookies({ nav, footer }: CookiePageProps) {
  const { t } = useTranslation('common')
  const contentSource = useCookieConsents()
  const { COOKIE_DOMAIN } = getConfig().publicRuntimeConfig

  return (
    <Layout header={nav} footer={footer}>
      <Head>
        <title>{t('site_title')}</title>
      </Head>
      <Container className="container">
        <CookiePage cookieDomain={COOKIE_DOMAIN} contentSource={contentSource} />
      </Container>
    </Layout>
  )
}

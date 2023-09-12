import { GetStaticPropsContext } from 'next'
import { Locale } from 'next-drupal'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import Link from '@/components/link/Link'
import { Layout } from '@/components/layout/Layout'
import { NavProps, FooterProps } from '@/lib/types'
import { getDrupalClient } from '@/lib/drupal-client'
import { primaryLanguages } from '@/lib/helpers'

const notFoundTexts = {
  fi: {
    text: "Sivua ei valitettavasti löytynyt.",
    linkText: "Palaa etusivulle"
  },
  sv: { text: "Sidan hittades inte.", linkText: "Gå till startsidan" },
  en: {
    text: "Sorry! We can't find the page you were looking for.",
    linkText: "Return to our Homepage"
  }
}

interface PageNotFoundProps {
  nav: NavProps
  footer: FooterProps
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const drupal = getDrupalClient();
  const { locale, defaultLocale } = context as { locale: Locale, defaultLocale: Locale }

  const langLinks = { fi: '/', en: '/en', sv: '/sv'}
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
    revalidate: 3600
  }
}

export const PageNotFound = ({ nav, footer }: PageNotFoundProps) => {
  const { locale } = useRouter()

  let texts;
  switch (locale) {
    case 'sv':
      texts = notFoundTexts.sv
      break
    case 'en':
      texts = notFoundTexts.en
      break
    case 'fi':
    default:
      texts = notFoundTexts.fi
      break
  }

  return (
    <Layout header={nav} footer={footer}>
      <div className="columns not-found">
        <div className="col-12">
          <h1>{texts.text}</h1>
          <Link
            href={`/${locale}`}
            text={texts.linkText}
          />
        </div>
      </div>
    </Layout>
  )
}

export default PageNotFound

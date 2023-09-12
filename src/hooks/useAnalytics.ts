import { useEffect, useState } from 'react'
import getConfig from 'next/config'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { Locale } from 'next-drupal'
import { useCookies } from 'hds-react'
import { setInitialLocale } from '@/lib/helpers'

export const useConsentStatus = (cookieId: string) => {
  const { getAllConsents } = useCookies();
  const consents = getAllConsents();
  return consents[cookieId];
};

export const useCookieConsents = (): any => {
  const { locale } = useRouter()
  const { t } = useTranslation()
  const [language, setLanguage] = useState<string>(setInitialLocale(locale ? locale : ''));
  const onLanguageChange = (newLang: Locale) => setLanguage(newLang);

  /**
   * @TODO Any better solution for translations on modal window?
   */
  const text: any = {
    matomo_description: {
      fi: 'Matomo-tilastointijärjestelmän eväste.',
      en: 'Matomo Analytics - used to store a few details about the user such as the unique visitor ID.',
      sv: 'Statistiksystemets kaka samlar information om hur webbplatsen används.'
    },
    rns_description: {
      fi: 'React & Share -reaktionappien toimintaan liittyvä tietue.',
      en: 'A record related to the operation of the React & Share react buttons.',
      sv: 'En post relaterad till driften av reaktionsknappen React & Share.'
    },
    period_minutes: {
      fi: 'minuuttia',
      en: 'minutes',
      sv: 'minuter',
    },
    period_days: {
      fi: 'päivää',
      en: 'days',
      sv: 'dagar'
    }
  }

  return {
    siteName: t('site_title'),
    currentLanguage: language,
    language: {
      onLanguageChange,
    },
    focusTargetSelector: '#focused-element-after-cookie-consent-closed',
    optionalCookies: {
      groups: [
        {
          commonGroup: 'statistics',
          cookies: [
            {
              id: 'matomo',
              hostName: 'tyollisyyspalvelut.hel.fi',
              name: '_pk_id.*',
              description: text['matomo_description'][language as string],
              expiration: `393 ${text['period_days'][language as string]}`,
            },
            {
              id: 'matomo_ses',
              hostName: 'tyollisyyspalvelut.hel.fi',
              name: '_pk_ses.*',
              description: text['matomo_description'][language as string],
              expiration: `30 ${text['period_minutes'][language as string]}`,
            },
            {
              id: 'matomo_id_kartta',
              name: '_pk_id.*',
              hostName: 'palvelukartta.hel.fi',
              description: text['matomo_description'][language as string],
              expiration: `393 ${text['period_days'][language as string]}`,
            },
            {
              id: 'rns',
              name: 'rnsbid',
              hostName: 'reactandshare.com',
              description: text['rns_description'][language as string],
              expiration: '-',
            },
            {
              id: 'rnsbid_ts',
              name: 'rnsbid_ts',
              hostName: 'reactandshare.com',
              description: text['rns_description'][language as string],
              expiration: '-',
            },
            {
              id: 'rns_reaction',
              name: 'rns_reaction_*',
              hostName: 'reactandshare.com',
              description: text['rns_description'][language as string],
              expiration: '-',
            },
          ],
        },
      ],
    },
    onAllConsentsGiven: (consents: any) => {
      /**
       * @TODO Check for better solution to get rid of Cookies needed infobox, when accepting cookies.
       */
      window.location.reload()
    },
  };
} 

export const useMatomo = (cookieConsent: boolean) => {
  const { MATOMO_URL: url, MATOMO_SITE_ID: siteId } = getConfig().publicRuntimeConfig

  useEffect(() => {
    const _paq = (window._paq = window._paq || [])
    const script = document.createElement("script")
    script.async = true
    script.src = `${url}piwik.min.js`
    script.type = "text/javascript"
    document.head.appendChild(script)
  
    // This means no tracking or cookies unless consent is given.
    _paq.push(['requireConsent'])
  
    /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
    _paq.push(["setCookieDomain", "*.tyollisyyspalvelut.hel.fi"])
  
    _paq.push(["trackPageView"])
  
    _paq.push(["enableLinkTracking"])
    _paq.push(["setTrackerUrl", `${url}tracker.php`])
    _paq.push(["setSiteId", siteId])
  
    // Enable or disable tracking by the selected consent
    cookieConsent ? window._paq.push(['setConsentGiven']) : window._paq.push(['forgetConsentGiven'])
  }, [cookieConsent])
}

export const useReactAndShare = (
  cookieConsent: boolean | undefined,
  lang: string | undefined,
  pageTitle: string | undefined
) => {
    const [reactAndShareApiKey, setReactAndShareApiKey] = useState(getConfig().publicRuntimeConfig.REACT_AND_SHARE_EN)
  useEffect(() => {
    if (cookieConsent !== true) {
      return
    }

    if (lang === 'fi') {
      setReactAndShareApiKey(getConfig().publicRuntimeConfig.REACT_AND_SHARE_FI)
    } else if (lang === 'sv') {
      setReactAndShareApiKey(getConfig().publicRuntimeConfig.REACT_AND_SHARE_SV)
    }

    const script = document.createElement("script")
    const resourceUrl = 'https://cdn.reactandshare.com/plugin/rns.js'
    script.src = resourceUrl
    script.type = "text/javascript"

    window.rnsData = {
      apiKey: reactAndShareApiKey,
      title: pageTitle || 'Työllisyyspalvelut',
      canonicalUrl: window.location.href,
      categories: ['Työllisyyspalvelut']
    }

    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [cookieConsent, lang])
}

import '../styles/globals.scss'
import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import { CookieModal } from 'hds-react';
import getConfig from 'next/config'
import { useConsentStatus, useCookieConsents, useMatomo } from '@/hooks/useAnalytics';
import { useEffect, useState } from 'react';

export const MyApp = ({ Component, pageProps }: AppProps) => {
  const { COOKIE_DOMAIN } = getConfig().publicRuntimeConfig
  const [ cookieModal, setCookieModal ] = useState<boolean>(true)
  
  useEffect(() => {
    if (window.top !== window.self) {
      setCookieModal(false)
    }
  },[])

  const contentSource = useCookieConsents()

  useMatomo(useConsentStatus('matomo'))

  return (
    <>
      { cookieModal && <CookieModal cookieDomain={COOKIE_DOMAIN} contentSource={contentSource} /> }
      <Component {...pageProps} />
    </>
  );
};

export default appWithTranslation(MyApp)

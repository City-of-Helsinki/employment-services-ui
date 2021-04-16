import { useEffect } from 'react';

export function ImportReactAndShare(cookieConsent: string, lang: string) {

  useEffect(() => {
    if (cookieConsent !== 'true') return;
    const reactAndShareApiKey = lang === 'fi' ? process.env.REACT_APP_REACT_AND_SHARE_FI : lang === 'sv' ? process.env.REACT_APP_REACT_AND_SHARE_SV : process.env.REACT_APP_REACT_AND_SHARE_EN;
    const script = document.createElement('script');
    const resourceUrl = 'https://cdn.reactandshare.com/plugin/rns.js';
    script.src = resourceUrl;
    script.type = "text/javascript";
    
    window.rnsData = {
      apiKey: reactAndShareApiKey,
      categories: ['Työllisyyspalvelut'],
    };
    
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    }
  }, [cookieConsent, lang]);
};

export function ImportMatomo(cookieConsent: string) {

  useEffect(() => {
    if (cookieConsent !== 'true') return;
    const script = document.createElement('script');
    const resourceUrl = '//webanalytics.digiaiiris.com/js/';
    script.async = true;
    script.src = resourceUrl + 'piwik.min.js';
    script.type = "text/javascript";
  
    const _paq = window._paq = window._paq || [];
    /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
    _paq.push(["setCookieDomain", "*.tyollisyyspalvelut.hel.fi"]);
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
    (function() {
      _paq.push(['setTrackerUrl', resourceUrl + 'tracker.php']);
      _paq.push(['setSiteId', '189']);
    })();

    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    }
  }, [cookieConsent]);
};

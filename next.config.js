// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
const { withSentryConfig } = require("@sentry/nextjs");

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};


const { i18n } = require('./next-i18next.config')

const publicRuntimeConfig = {
  NEXT_PUBLIC_DRUPAL_BASE_URL: process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,
  NEXT_IMAGE_DOMAIN: process.env.NEXT_IMAGE_DOMAIN,
  MATOMO_SITE_ID: process.env.MATOMO_SITE_ID,
  MATOMO_URL: process.env.MATOMO_URL,
  REACT_AND_SHARE_FI: process.env.REACT_AND_SHARE_FI,
  REACT_AND_SHARE_SV: process.env.REACT_AND_SHARE_SV,
  REACT_AND_SHARE_EN: process.env.REACT_AND_SHARE_EN,
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN
}

const serverRuntimeConfig = {
  REVALIDATE_TIME: 60, //seconds
  BUILD_PHASE: process.env.BUILD_PHASE || false,
  ELASTICSEARCH_URL: process.env.ELASTICSEARCH_URL,
  elasticsearch_password: process.env.elasticsearch_password,
  elasticsearch_certificate: process.env.elasticsearch_certificate,
  NEXT_PUBLIC_DRUPAL_BASE_URL: process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,
  DRUPAL_FRONT_PAGE: process.env.DRUPAL_FRONT_PAGE,
  DRUPAL_CLIENT_ID: process.env.DRUPAL_CLIENT_ID,
  DRUPAL_CLIENT_SECRET: process.env.DRUPAL_CLIENT_SECRET,
  DRUPAL_PREVIEW_SECRET: process.env.DRUPAL_PREVIEW_SECRET,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_INSTANCE: process.env.REDIS_INSTANCE,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PREFIX: process.env.REDIS_PREFIX
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,
  reactStrictMode: true,
  publicRuntimeConfig,
  serverRuntimeConfig,
  images: {
    domains: [process.env.NEXT_IMAGE_DOMAIN, 'api.hel.fi'],
    deviceSizes: [576, 768, 992, 1200]
  },
  async redirects() {
    return [
      {
        source: '/tapahtumat',
        destination: '/ajankohtaista/tapahtumat',
        permanent: true,
      },
      {
        source: '/evenemang',
        destination: '/aktuellt/evenemang',
        permanent: true,
      },
      {
        source: '/events',
        destination: '/current-matters/events',
        permanent: true,
      },
      {
        source: '/tapahtuma/:slug',
        destination: '/ajankohtaista/tapahtumat/:slug',
        permanent: true,
      },
      {
        source: '/evenemang/:slug',
        destination: '/aktuellt/evenemang/:slug',
        permanent: true,
      },
      {
        source: '/event/:slug',
        destination: '/current-matters/events/:slug',
        permanent: true,
      },
      {
        source: '/miten_loydan_toita',
        destination: '/tyonhaku/apua-tyonhakuun',
        permanent: true,
      },
      {
        source: '/tukea_ja_valmennusta',
        destination: '/tyonhaku/apua-tyonhakuun/valmennukset',
        permanent: true,
      },
      {
        source: '/tyokokeilu',
        destination: '/tyonhaku/tuetut-tyopaikat/tyokokeilu',
        permanent: true,
      },
      {
        source: '/tyokokeilupaikat',
        destination: '/tyonhaku/tuetut-tyopaikat/tyokokeilu/helsingin-kaupungin-avoimet-tyokokeilupaikat',
        permanent: true,
      },
      {
        source: '/palkkatuki',
        destination: '/tyonhaku/tuetut-tyopaikat/palkkatuki',
        permanent: true,
      },
      {
        source: '/palkkatukipaikat',
        destination: '/tyonhaku/tuetut-tyopaikat/palkkatuki/helsingin-kaupungin-palkkatuetut-tyopaikat',
        permanent: true,
      },
      {
        source: '/helsinki-lisa',
        destination: '/tyonhaku/tuetut-tyopaikat/helsinki-lisa',
        permanent: true,
      },
      {
        source: '/yrittajyys',
        destination: '/tyonhaku/yrittajyys',
        permanent: true,
      },
      {
        source: '/koulutusneuvonta',
        destination: '/koulutus/koulutusneuvonta',
        permanent: true,
      },
      {
        source: '/opiskelu-tyottomana',
        destination: '/koulutus/opiskelu-tyottomana',
        permanent: true,
      },
      {
        source: '/tyovoimakoulutukset',
        destination: '/koulutus/tyovoimakoulutus',
        permanent: true,
      },
      {
        source: '/oppisopimus',
        destination: '/koulutus/oppisopimus',
        permanent: true,
      },
      {
        source: '/terveys-tyokyky',
        destination: '/tyokyky',
        permanent: true,
      },
      {
        source: '/kykyviihki',
        destination: '/tyokyky/kykyviisari',
        permanent: true,
      },
      {
        source: '/asiakkaaksi_kokeiluun',
        destination: '/asiointi/tervetuloa-asiakkaaksi',
        permanent: true,
      },
      {
        source: '/tyollistymissuunnitelma',
        destination: '/asiointi/tyollistymissuunnitelma',
        permanent: true,
      },
      {
        source: '/oma_vastuuasiantuntija',
        destination: '/asiointi/oma-vastuuasiantuntija',
        permanent: true,
      },
      {
        source: '/lomakkeet',
        destination: '/asiointi/lomakkeet',
        permanent: true,
      },
      {
        source: '/nain_asioit_ota_yhteytta',
        destination: '/yhteystiedot',
        permanent: true,
      },
      {
        source: '/tapahtumat',
        destination: '/ajankohtaista/tapahtumat',
        permanent: true,
      },
      { 
        source: '/tapahtuma/:slug', 
        destination: '/ajankohtaista/tapahtumat/:slug',
        permanent: true, 
      },
      {
        source: '/blogi',
        destination: '/ajankohtaista/uutiset',
        permanent: true,
      },
      {
        source: '/uutiset',
        destination: '/ajankohtaista/uutiset',
        permanent: true,
      },
      {
        source: '/QA_asiakaspalvelumalli',
        destination: '/ajankohtaista/uusi-palvelumalli',
        permanent: true,
      },
      {
        source: '/QA',
        destination: '/ajankohtaista/uusi-palvelumalli',
        permanent: true,
      },
      {
        source: '/QA_kuntakokeilu',
        destination: '/tyollisyyden-kuntakokeilu',
        permanent: true,
      },
      {
        source: '/yrityskoordinaattorit',
        destination: 'https://www.hel.fi/fi/yritykset-ja-tyo/tyonantajat/rekrytoinnin-tuki',
        permanent: true,
      },
      {
        source: '/rekrytointitapahtumat',
        destination: 'https://www.hel.fi/fi/yritykset-ja-tyo/tyonantajat/rekrytoinnin-tuki/yrityskoordinaattorit',
        permanent: true,
      },
      {
        source: '/taloudelliset_tuet',
        destination: 'https://www.hel.fi/fi/yritykset-ja-tyo/tyonantajat/taloudelliset-tuet',
        permanent: true,
      },
      {
        source: '/neuvonta-eri-kielilla',
        destination: '/',
        permanent: true,
      },
      {
        source: '/kotoutuminen_ja_tyollistyminen',
        destination: '/',
        permanent: true,
       },
      {
        source: '/kielen-opiskelu',
        destination: '/',
        permanent: true,
      },
      {
        source: '/ammatillinen_osaaminen',
        destination: '/',
        permanent: true,
      },
      {
        source: '/hur-hittar-jag-arbete',
        destination: '/arbetssokande/hjalp-med-att-soka-jobb',
        permanent: true,
      },
      {
        source: '/stod-och-traning',
        destination: '/arbetssokande/hjalp-med-att-soka-jobb/coachningar',
        permanent: true,
      },
      {
        source: '/arbetsprovning',
        destination: '/arbetssokande/subventionerat-arbete/arbetsprovning',
        permanent: true,
      },
      {
        source: '/arbetsprovnings',
        destination: '/arbetssokande/subventionerat-arbete/arbetsprovning/helsingfors-stads-lediga-platser',
        permanent: true,
      },
      {
        source: '/lonesubvention',
        destination: '/arbetssokande/subventionerat-arbete/lonesubvention',
        permanent: true,
      },
      {
        source: '/lonesubventionerade-arbete',
        destination: '/arbetssokande/subventionerat-arbete/helsingforstillagg',
        permanent: true,
      },
      {
        source: '/helsingforstillagget',
        destination: '/arbetssokande/foretagande',
        permanent: true,
      },
      {
        source: '/foretagande',
        destination: '/arbetssokande/foretagande',
        permanent: true,
      },
      {
        source: '/utbildningsradgivning',
        destination: '/utbildning/utbildningsradgivning',
        permanent: true,
      },
      {
        source: '/studier-som-arbetslos',
        destination: '/utbildning/studier-som-arbetslos',
        permanent: true,
      },
      {
        source: '/arbetskraftsutbildning',
        destination: '/utbildning/arbetskraftsutbildning',
        permanent: true,
      },
      {
        source: '/laroavtal',
        destination: '/utbildning/laroavtal',
        permanent: true,
      },
      {
        source: '/halsa-och-arbetsformaga',
        destination: '/arbetsformaga',
        permanent: true,
      },
      {
        source: '/Form%C3%A5gare',
        destination: '/arbetsformaga/formagaren',
        permanent: true,
      },
      {
        source: '/delta-i-forsoket',
        destination: '/utratta-arenden/valkommen-som-kund',
        permanent: true,
      },
      {
        source: '/sysselsattningsplan',
        destination: '/utratta-arenden/sysselsattningsplan',
        permanent: true,
      },
      {
        source: '/en-egen-ansvarig-sakkunnig',
        destination: '/utratta-arenden/min-ansvariga-sakkunniga',
        permanent: true,
      },
      {
        source: '/blanketter',
        destination: '/utratta-arenden/blanketter',
        permanent: true,
      },
      {
        source: '/ta-kontakt',
        destination: '/kontaktuppgifter',
        permanent: true,
      },
      {
        source: '/evenemang',
        destination: '/aktuellt/evenemang',
        permanent: true,
      },
      { 
        source: '/evenemang/:slug', 
        destination: '/aktuellt/evenemang/:slug',
        permanent: true, 
      },
      {
        source: '/blogg',
        destination: '/aktuellt/nyheter',
        permanent: true,
      },
      {
        source: '/nyheter',
        destination: '/aktuellt/nyheter',
        permanent: true,
      },
      {
        source: '/qa_kundservicemodell',
        destination: '/aktuellt/ny-servicemodell',
        permanent: true,
      },
      {
        source: '/QA',
        destination: '/aktuellt/ny-servicemodell',
        permanent: true,
      },
      {
        source: '/qa_kommunforsoken_med_sysselsattning',
        destination: '/om-kommunforsoken',
        permanent: true,
      },
      {
        source: '/foretagskoordinatorernas-tjanster',
        destination: 'https://www.hel.fi/sv/foretag-och-arbete/arbetsgivare/stod-till-rekrytering',
        permanent: true,
      },
      {
        source: '/rekryteringsevenemang',
        destination: 'https://www.hel.fi/sv/foretag-och-arbete/arbetsgivare/stod-till-rekrytering',
        permanent: true,
      },
      {
        source: '/ekonomiskt-stod',
        destination: 'https://www.hel.fi/sv/foretag-och-arbete/arbetsgivare/ekonomiska-stod',
        permanent: true,
      },
      {
        source: '/radgivning-pa-flera-sprak',
        destination: '/',
        permanent: true,
      },
      {
        source: '/integration-och-sysselsattning',
        destination: '/',
        permanent: true,
      },
      {
        source: '/sprakstudier',
        destination: '/',
        permanent: true,
      },
      {
        source: '/yrkeskompetens',
        destination: '/',
        permanent: true,
      },
      {
        source: '/how-can-i-find-work',
        destination: '/job-seeking/help-jobseeking',
        permanent: true,
      },
      {
        source: '/support-and-training',
        destination: '/job-seeking/help-jobseeking/coaching',
        permanent: true,
      },
      {
        source: '/work_try_outs',
        destination: '/job-seeking/supported-jobs/work-try-out',
        permanent: true,
      },
      {
        source: '/work-try-outs',
        destination: '/job-seeking/supported-jobs/work-try-out/available-work-try-outs-city-helsinki',
        permanent: true,
      },
      {
        source: '/pay-subsidy',
        destination: '/job-seeking/supported-jobs/pay-subsidy',
        permanent: true,
      },
      {
        source: '/pay-subsidised-jobs',
        destination: '/job-seeking/supported-jobs/pay-subsidy/pay-subsidised-jobs-city-helsinki',
        permanent: true,
      },
      {
        source: '/helsinki-benefit',
        destination: '/job-seeking/supported-jobs/helsinki-benefit',
        permanent: true,
      },
      {
        source: '/entrepreneur',
        destination: '/job-seekingtrepreneurship',
        permanent: true,
      },
      {
        source: '/education-advice',
        destination: '/education/education-advice',
        permanent: true,
      },
      {
        source: '/studying-while-unemployed',
        destination: '/education/studying-while-unemployed',
        permanent: true,
      },
      {
        source: '/vocational-labour-market-training',
        destination: '/education/labour-market-training',
        permanent: true,
      },
      {
        source: '/apprenticeship',
        destination: '/education/apprenticeship',
        permanent: true,
      },
      {
        source: '/health-and-work-ability',
        destination: '/work-ability',
        permanent: true,
      },
      {
        source: '/abilitator',
        destination: '/work-ability/abilitator',
        permanent: true,
      },
      {
        source: '/becoming-a-trial-client',
        destination: '/official-matters/welcome-client',
        permanent: true,
      },
      {
        source: '/employment-plan',
        destination: '/official-matters/employment-plan',
        permanent: true,
      },
      {
        source: '/your-specialist',
        destination: '/official-matters/your-specialist',
        permanent: true,
      },
      {
        source: '/forms',
        destination: '/official-matters/forms',
        permanent: true,
      },
      {
        source: '/contact-us',
        destination: '/contact-information',
        permanent: true,
      },
      {
        source: '/events',
        destination: '/current-matters/events',
        permanent: true,
      },
      { 
        source: '/event/:slug', 
        destination: '/current-matters/events/:slug',
        permanent: true, 
      },
      {
        source: '/blog',
        destination: '/current-matters/news',
        permanent: true,
      },
      {
        source: '/news',
        destination: '/current-matters/news',
        permanent: true,
      },
      {
        source: '/qa_service_model',
        destination: '/current-matters/new-service-model',
        permanent: true,
      },
      {
        source: '/QA',
        destination: '/current-matters/new-service-model',
        permanent: true,
      },
      {
        source: '/qa_municipal_employment_experiment',
        destination: '/municipal-employment-experiment',
        permanent: true,
      },
      {
        source: '/business-coordinator',
        destination: 'https://www.hel.fi/en/business-and-work/employers/support-for-employment',
        permanent: true,
      },
      {
        source: '/recruitment-events',
        destination: 'https://www.hel.fi/en/business-and-work/employers/support-for-employment',
        permanent: true,
      },
      {
        source: '/financial-support',
        destination: 'https://www.hel.fi/en/business-and-work/employers/financial-support',
        permanent: true,
      },
      {
        source: '/advice-in-different-languages',
        destination: '/',
        permanent: true,
      },
      {
        source: '/Integration-and-employment',
        destination: '/',
        permanent: true,
      },
      {
        source: '/learning-a-language',
        destination: '/',
        permanent: true,
      },
      {
        source: '/vocational-skills',
        destination: '/',
        permanent: true,
      },
    ]
  },
  sentry: {
    hideSourceMaps: true
    // See the sections below for information on the following options:
    //   'Configure Source Maps':
    //     - disableServerWebpackPlugin
    //     - disableClientWebpackPlugin
    //     - hideSourceMaps
    //     - widenClientFileUpload
    //   'Configure Legacy Browser Support':
    //     - transpileClientSDK
    //   'Configure Serverside Auto-instrumentation':
    //     - autoInstrumentServerFunctions
    //     - excludeServerRoutes
    //   'Configure Tunneling to avoid Ad-Blockers':
    //     - tunnelRoute
  }
}
// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
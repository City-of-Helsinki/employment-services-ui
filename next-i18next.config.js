const languages = [
  { code: 'fi', text: 'Suomi' },
  { code: 'sv', text: 'Svenska' },
  { code: 'en', text: 'English' },
]

const locales = languages.map(({ code }) => code)

module.exports = {
  i18n: {
    reloadOnPrerender: typeof process.env.development !== 'undefined',
    locales,
    languages,
    defaultLocale: 'fi',
    fallbackLocale: 'fi',
  },
}

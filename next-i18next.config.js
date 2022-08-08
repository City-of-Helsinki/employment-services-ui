const languages = [
  { code: 'fi', text: 'Suomi' },
  { code: 'sv', text: 'Svenska' },
  { code: 'en', text: 'English' }
]

const locales = languages.map(({ code }) => code)

module.exports = {
  i18n: {
    locales,
    defaultLocale: 'fi',
    localeDetection: false
  }
}

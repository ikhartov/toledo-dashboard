import en from '~~/i18n/locales/en'

export default defineI18nConfig(() => ({
  lazy: true,
  legacy: false,
  fallbackLocale: 'en',
  locale: 'en',
  messages: { en },
  datetimeFormats: {
    en: {
      short: { year: 'numeric', month: 'short', day: 'numeric' },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric'
      }
    }
  }
}))

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import resources from './locales'
import { getCurrentLang } from './components/LanguageSwitcher'

const lang = getCurrentLang()

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: lang,
    fallbackLng: 'en',
    debug: true,

    interpolation: {
      escapeValue: false,
      format(value, format, lng) {
        if (format === 'localizedNumber') {
          return new Intl.NumberFormat(lng).format(value)
        }
        return value
      },
    },

    react: {
      useSuspense: false,
    },
  })

export default i18n

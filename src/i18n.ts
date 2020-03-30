import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import numeral from 'numeral'
import resources from './locales'
import { getCurrentLang } from './components/LanguageSwitcher'

import langs from './langs'

const lang = getCurrentLang()

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: lang,
    fallbackLng: 'en',
    debug: true,
    keySeparator: false, // Disable dots as key separators as we use dots in keys

    interpolation: {
      escapeValue: false,
      format(value, format, lng) {
        return value
      },
    },

    react: {
      useSuspense: false,
    },
  })

i18n.on('languageChanged', (lang) => {
  numeral.locale(langs[lang].numeralLocale)
})

numeral.locale(langs[lang].numeralLocale)

export { numeral }

export default i18n

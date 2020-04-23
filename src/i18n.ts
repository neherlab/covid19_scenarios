import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import numbro from 'numbro'

import resources from './locales'
import { getCurrentLang } from './components/Layout/LanguageSwitcher'

import SupportedLocales, { SupportedLocale } from './langs'

// FIXME: make it an import if possible
// eslint-disable-next-line @typescript-eslint/no-var-requires
Object.values(require('numbro/dist/languages.min.js')).forEach((l) =>
  numbro.registerLanguage(l as numbro.NumbroLanguage),
)

const lang = getCurrentLang()

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: lang,
    fallbackLng: 'en',
    debug: process.env.DEV_ENABLE_I18N_DEBUG === '1',
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

i18n.on('languageChanged', (lang: SupportedLocale) => {
  numbro.setLanguage(SupportedLocales[lang].numbroLocale)
})

numbro.setLanguage(SupportedLocales[lang].numbroLocale)

export { numbro }

export default i18n

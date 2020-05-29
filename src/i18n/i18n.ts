/* eslint-disable only-ascii/only-ascii */
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import moment from 'moment'
import numbro from 'numbro'

import en from './resources/en.json'
import de from './resources/de.json'
import es from './resources/es.json'
import fr from './resources/fr.json'
import pl from './resources/pl.json'
import pt from './resources/pt.json'

export const DEFAULT_LOCALE = 'en'

export const localized = { number: '{{value, localizedNumber}}' }
export const resources = { en: { ...en, localized }, pt, fr, de, es, pl }

export const locales = {
  en: {
    lang: 'en',
    numbroLocale: 'en-US',
    name: 'English',
  },
  de: {
    lang: 'de',
    numbroLocale: 'de-DE',
    name: 'Deutsch',
  },
  es: {
    lang: 'es',
    numbroLocale: 'es-ES',
    name: 'Español',
  },
  fr: {
    lang: 'fr',
    numbroLocale: 'fr-FR',
    name: 'Français',
  },
  pl: {
    lang: 'pl',
    numbroLocale: 'pl-PL',
    name: 'Polski',
  },
  pt: {
    lang: 'pt',
    numbroLocale: 'pt-PT',
    name: 'Português',
  },
} as const

export type Locale = keyof typeof locales
// export type Locale = typeof locales[keyof typeof locales]

// FIXME: make it an import if possible
// eslint-disable-next-line @typescript-eslint/no-var-requires
Object.values(require('numbro/dist/languages.min.js')).forEach((l) =>
  numbro.registerLanguage(l as numbro.NumbroLanguage),
)

export function changeLocale(locale: Locale) {
  i18n.changeLanguage(locale)
  numbro.setLanguage(locales[locale].numbroLocale)
  moment.locale(locale)
}

i18n.use(initReactI18next).init({
  resources,
  lng: DEFAULT_LOCALE,
  fallbackLng: DEFAULT_LOCALE,
  debug: process.env.DEV_ENABLE_I18N_DEBUG === '1',
  keySeparator: false, // Disable dots as key separators as we use dots in keys
  nsSeparator: false,

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

changeLocale(DEFAULT_LOCALE)

export { numbro }

export default i18n

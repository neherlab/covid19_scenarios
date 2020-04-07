/* eslint-disable only-ascii/only-ascii */
const SupportedLocales = {
  en: {
    lang: 'en',
    numbroLocale: 'en-US',
    name: 'english',
  },
  fr: {
    lang: 'fr',
    numbroLocale: 'fr-FR',
    name: 'français',
  },
  pt: {
    lang: 'pt',
    numbroLocale: 'pt-PT',
    name: 'português',
  },
  de: {
    lang: 'de',
    numbroLocale: 'de-DE',
    name: 'deutsch',
  },
  es: {
    lang: 'es',
    numbroLocale: 'es-ES',
    name: 'español',
  },
  pl: {
    lang: 'pl',
    numbroLocale: 'pl-PL',
    name: 'polski',
  },
} as const

export type SupportedLocale = keyof typeof SupportedLocales
export type Locale = typeof SupportedLocales[keyof typeof SupportedLocales]

export default SupportedLocales

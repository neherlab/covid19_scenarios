/* eslint-disable only-ascii/only-ascii */
import { mapValues } from 'lodash'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import moment from 'moment'
import numbro from 'numbro'

import US from 'flag-icon-css/flags/1x1/us.svg'
import DE from 'flag-icon-css/flags/1x1/de.svg'
import ES from 'flag-icon-css/flags/1x1/es.svg'
import FR from 'flag-icon-css/flags/1x1/fr.svg'
import PL from 'flag-icon-css/flags/1x1/pl.svg'
import PT from 'flag-icon-css/flags/1x1/pt.svg'

import en from './resources/en.json'
import de from './resources/de.json'
import es from './resources/es.json'
import fr from './resources/fr.json'
import pl from './resources/pl.json'
import pt from './resources/pt.json'

export const localized = { number: '{{value, localizedNumber}}' } as const
export const translations = { en, pt, fr, de, es, pl }
export const flags = new Map()

export type LocaleKey = keyof typeof translations

export const DEFAULT_LOCALE_KEY: LocaleKey = 'en'
export const resources = mapValues(translations, (value) => ({ translation: value }))
export const localeKeys = Object.keys(translations) as LocaleKey[]

export interface Locale {
  readonly full: string
  readonly flag: string
  readonly name: string
  readonly Flag: React.ElementType
}

export interface LocaleWithKey extends Locale {
  key: LocaleKey
}

export const locales: Record<LocaleKey, Locale> = {
  en: { full: 'en-US', flag: 'us', name: 'English', Flag: US },
  de: { full: 'de-DE', flag: 'de', name: 'Deutsch', Flag: DE },
  es: { full: 'es-ES', flag: 'es', name: 'Español', Flag: ES },
  fr: { full: 'fr-FR', flag: 'fr', name: 'Français', Flag: FR },
  pl: { full: 'pl-PL', flag: 'pl', name: 'Polski', Flag: PL },
  pt: { full: 'pt-PT', flag: 'pt', name: 'Português', Flag: PT },
} as const

export const localesArray: LocaleWithKey[] = Object.entries(locales).map(([key, value]) => ({
  ...value,
  key: key as LocaleKey,
}))

export interface I18NInitParams {
  localeKey: LocaleKey
}

export async function i18nInit({ localeKey }: I18NInitParams) {
  // FIXME: make it an import if possible
  // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
  Object.values(require('numbro/dist/languages.min.js')).forEach((l) =>
    numbro.registerLanguage(l as numbro.NumbroLanguage),
  )

  await i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
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

  return changeLocale(localeKey)
}

export function getLocaleWithKey(key: LocaleKey) {
  return { ...locales[key], key }
}

export async function changeLocale(localeKey: LocaleKey) {
  const locale = locales[localeKey]
  moment.locale(localeKey)
  numbro.setLanguage(locale.full)
  return i18n.changeLanguage(localeKey)
}

export { numbro }

export default i18n

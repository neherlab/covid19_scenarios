import { ElementType } from 'react'

import { mapValues } from 'lodash'

import i18nOriginal, { i18n as I18N } from 'i18next'
import { initReactI18next } from 'react-i18next'

import moment from 'moment'
import numbro from 'numbro'
import { languages } from 'countries-list'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import numbroLanguages from 'numbro/dist/languages.min'

import { ReactComponent as US } from 'flag-icon-css/flags/1x1/us.svg'
import { ReactComponent as DE } from 'flag-icon-css/flags/1x1/de.svg'
import { ReactComponent as ES } from 'flag-icon-css/flags/1x1/es.svg'
import { ReactComponent as FR } from 'flag-icon-css/flags/1x1/fr.svg'
import { ReactComponent as PL } from 'flag-icon-css/flags/1x1/pl.svg'
import { ReactComponent as PT } from 'flag-icon-css/flags/1x1/pt.svg'

import en from './resources/en/common.json'
import de from './resources/de/common.json'
import es from './resources/es/common.json'
import fr from './resources/fr/common.json'
import pl from './resources/pl/common.json'
import pt from './resources/pt/common.json'

export const localized = { number: '{{value, localizedNumber}}' } as const
export const translations = { en, de, es, fr, pl, pt }
export const flags = new Map()

export type LocaleKey = keyof typeof translations

export const DEFAULT_LOCALE_KEY: LocaleKey = 'en'
export const resources = mapValues(translations, (value) => ({ translation: value }))
export const localeKeys = Object.keys(translations) as LocaleKey[]

export interface Locale {
  readonly full: string
  readonly name: string
  readonly Flag: ElementType
}

export interface LocaleWithKey extends Locale {
  key: LocaleKey
}

export const locales: Record<LocaleKey, Locale> = {
  en: { full: 'en-US', name: languages.en.native, Flag: US },
  de: { full: 'de-DE', name: languages.de.native, Flag: DE },
  es: { full: 'es-ES', name: languages.es.native, Flag: ES },
  fr: { full: 'fr-FR', name: languages.fr.native, Flag: FR },
  pl: { full: 'pl-PL', name: languages.pl.native, Flag: PL },
  pt: { full: 'pt-PT', name: languages.pt.native, Flag: PT },
} as const

export const localesArray: LocaleWithKey[] = Object.entries(locales).map(([key, value]) => ({
  ...value,
  key: key as LocaleKey,
}))

export interface I18NInitParams {
  localeKey: LocaleKey
}

export function i18nInit({ localeKey }: I18NInitParams) {
  const enUS = numbro.languages()['en-US']
  const allNumbroLanguages = numbroLanguages as numbro.NumbroLanguage
  Object.values(allNumbroLanguages).forEach((languageRaw) => {
    // If a language object lacks some of the features, substitute these features from English
    numbro.registerLanguage({ ...enUS, ...languageRaw })
  })

  const i18n = i18nOriginal.use(initReactI18next).createInstance({
    resources,
    lng: DEFAULT_LOCALE_KEY,
    fallbackLng: DEFAULT_LOCALE_KEY,
    debug: process.env.DEV_ENABLE_I18N_DEBUG === '1',
    keySeparator: false, // Disable dots as key separators as we use dots in keys
    nsSeparator: false,
    interpolation: { escapeValue: false },
  })

  // eslint-disable-next-line no-void
  void i18n.init()

  const locale = locales[localeKey]
  moment.locale(localeKey)
  numbro.setLanguage(locale.full)

  return i18n
}

export function getLocaleWithKey(key: LocaleKey) {
  return { ...locales[key], key }
}

export async function changeLocale(i18n: I18N, localeKey: LocaleKey) {
  const locale = locales[localeKey]
  moment.locale(localeKey)
  numbro.setLanguage(locale.full)
  return i18n.changeLanguage(localeKey)
}

const i18n = i18nInit({ localeKey: DEFAULT_LOCALE_KEY })

export { numbro }

export default i18n

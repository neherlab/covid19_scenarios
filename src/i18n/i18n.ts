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

import { ReactComponent as SA } from 'flag-icon-css/flags/1x1/sa.svg'
import { ReactComponent as DE } from 'flag-icon-css/flags/1x1/de.svg'
import { ReactComponent as US } from 'flag-icon-css/flags/1x1/us.svg'
import { ReactComponent as ES } from 'flag-icon-css/flags/1x1/es.svg'
import { ReactComponent as IR } from 'flag-icon-css/flags/1x1/ir.svg'
import { ReactComponent as FR } from 'flag-icon-css/flags/1x1/fr.svg'
import { ReactComponent as IN } from 'flag-icon-css/flags/1x1/in.svg'
import { ReactComponent as IT } from 'flag-icon-css/flags/1x1/it.svg'
import { ReactComponent as JP } from 'flag-icon-css/flags/1x1/jp.svg'
import { ReactComponent as KR } from 'flag-icon-css/flags/1x1/kr.svg'
import { ReactComponent as PL } from 'flag-icon-css/flags/1x1/pl.svg'
import { ReactComponent as PT } from 'flag-icon-css/flags/1x1/pt.svg'
import { ReactComponent as RU } from 'flag-icon-css/flags/1x1/ru.svg'
import { ReactComponent as TR } from 'flag-icon-css/flags/1x1/tr.svg'
import { ReactComponent as CN } from 'flag-icon-css/flags/1x1/cn.svg'

import ar from './resources/ar/common.json'
import de from './resources/de/common.json'
import en from './resources/en/common.json'
import es from './resources/es/common.json'
import fa from './resources/fa/common.json'
import fr from './resources/fr/common.json'
import hi from './resources/hi/common.json'
import it from './resources/it/common.json'
import ja from './resources/ja/common.json'
import ko from './resources/ko/common.json'
import pl from './resources/pl/common.json'
import pt from './resources/pt/common.json'
import ru from './resources/ru/common.json'
import tr from './resources/tr/common.json'
import zh from './resources/zh/common.json'

export const localized = { number: '{{value, localizedNumber}}' } as const
export const translations = { ar, de, en, es, fa, fr, hi, it, ja, ko, pl, pt, ru, tr, zh }
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
  ar: { full: 'ar-SA', name: languages.ar.native, Flag: SA },
  de: { full: 'de-DE', name: languages.de.native, Flag: DE },
  en: { full: 'en-EN', name: languages.en.native, Flag: US },
  es: { full: 'es-ES', name: languages.es.native, Flag: ES },
  fa: { full: 'fa-IR', name: languages.fa.native, Flag: IR },
  fr: { full: 'fr-FR', name: languages.fr.native, Flag: FR },
  hi: { full: 'hi-IN', name: languages.hi.native, Flag: IN },
  it: { full: 'it-IT', name: languages.it.native, Flag: IT },
  ja: { full: 'ja-JP', name: languages.ja.native, Flag: JP },
  ko: { full: 'ko-KR', name: languages.ko.native, Flag: KR },
  pl: { full: 'pl-PL', name: languages.pl.native, Flag: PL },
  pt: { full: 'pt-PT', name: languages.pt.native, Flag: PT },
  ru: { full: 'ru-RU', name: languages.ru.native, Flag: RU },
  tr: { full: 'tr-TR', name: languages.tr.native, Flag: TR },
  zh: { full: 'zh-CN', name: languages.zh.native, Flag: CN },
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

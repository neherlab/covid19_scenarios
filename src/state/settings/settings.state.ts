import { detectLocale } from '../../i18n/detectLocale'
import { DEFAULT_LOCALE_KEY, LocaleKey, localeKeys } from '../../i18n/i18n'

export interface SettingsState {
  isAutorunEnabled: boolean
  shouldFormatNumbers: boolean
  isLogScale: boolean
  areResultsMaximized: boolean
  disclaimerVersionAccepted?: number
  disclaimerShouldSuppress: boolean
  localeKey: LocaleKey
}

export const settingsDefaultState: SettingsState = {
  isAutorunEnabled: true,
  shouldFormatNumbers: true,
  isLogScale: true,
  areResultsMaximized: typeof window !== 'undefined' && window?.innerWidth > 2000,
  disclaimerVersionAccepted: undefined,
  disclaimerShouldSuppress: false,
  localeKey: detectLocale({ defaultLanguage: DEFAULT_LOCALE_KEY, availableLocales: localeKeys }),
}

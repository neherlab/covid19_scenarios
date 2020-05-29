import { DEFAULT_LOCALE, Locale } from '../../i18n/i18n'

export interface SettingsState {
  isAutorunEnabled: boolean
  shouldFormatNumbers: boolean
  isLogScale: boolean
  areResultsMaximized: boolean
  disclaimerVersionAccepted?: number
  disclaimerShouldSuppress: boolean
  locale: Locale
}

export const settingsDefaultState: SettingsState = {
  isAutorunEnabled: true,
  shouldFormatNumbers: true,
  isLogScale: true,
  areResultsMaximized: typeof window !== 'undefined' && window?.innerWidth > 2000,
  disclaimerVersionAccepted: undefined,
  disclaimerShouldSuppress: false,
  locale: DEFAULT_LOCALE,
}

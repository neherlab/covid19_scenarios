import { DEFAULT_LOCALE_KEY, LocaleKey } from '../../i18n/i18n'

export interface SettingsState {
  isAutorunEnabled: boolean
  shouldFormatNumbers: boolean
  selectShouldShowPlotLabels: boolean
  isLogScale: boolean
  areResultsMaximized: boolean
  disclaimerVersionAccepted?: number
  disclaimerShouldSuppress: boolean
  localeKey: LocaleKey
}

export const settingsDefaultState: SettingsState = {
  isAutorunEnabled: true,
  shouldFormatNumbers: true,
  selectShouldShowPlotLabels: false,
  isLogScale: true,
  areResultsMaximized: typeof window !== 'undefined' && window?.innerWidth > 2000,
  disclaimerVersionAccepted: undefined,
  disclaimerShouldSuppress: false,
  localeKey: DEFAULT_LOCALE_KEY,
}

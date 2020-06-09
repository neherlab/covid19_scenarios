import type { State } from '../reducer'
import { LocaleKey, LocaleWithKey, getLocaleWithKey } from '../../i18n/i18n'

export const selectIsAutorunEnabled = (state: State): boolean => state.settings.isAutorunEnabled

export const selectIsLogScale = (state: State): boolean => state.settings.isLogScale

export const selectShouldFormatNumbers = (state: State): boolean => state.settings.shouldFormatNumbers

export const selectShouldShowPlotLabels = (state: State): boolean => state.settings.selectShouldShowPlotLabels

export const selectAreResultsMaximized = (state: State): boolean => state.settings.areResultsMaximized

export const selectDisclaimerVersionAccepted = (state: State): number | undefined =>
  state.settings.disclaimerVersionAccepted

export const selectDisclaimerShouldSuppress = (state: State): boolean => state.settings.disclaimerShouldSuppress

export const selectLocaleKey = (state: State): LocaleKey => state.settings.localeKey

export const selectLocale = (state: State): LocaleWithKey => getLocaleWithKey(selectLocaleKey(state))

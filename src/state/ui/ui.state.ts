import { DEFAULT_LOCALE, Locale } from '../../i18n/i18n'

export interface UiState {
  locale: Locale
}

export const uiDefaultState: UiState = {
  locale: DEFAULT_LOCALE,
}

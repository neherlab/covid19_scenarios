export interface SettingsState {
  isAutorunEnabled: boolean
  shouldFormatNumbers: boolean
  isLogScale: boolean
  areResultsMaximized: boolean
}

export const settingsDefaultState: SettingsState = {
  isAutorunEnabled: true,
  shouldFormatNumbers: true,
  isLogScale: true,
  areResultsMaximized: typeof window !== 'undefined' && window?.innerWidth > 2000,
}

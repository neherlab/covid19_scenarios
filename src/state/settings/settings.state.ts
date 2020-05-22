export interface SettingsState {
  isAutorunEnabled: boolean
  shouldFormatNumbers: boolean
  isLogScale: boolean
}

export const settingsDefaultState: SettingsState = {
  isAutorunEnabled: true,
  shouldFormatNumbers: true,
  isLogScale: true,
}

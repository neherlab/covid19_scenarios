export interface SettingsState {
  isAutorunEnabled: boolean
  shouldFormatNumbers: boolean
  isLogScale: boolean
  areResultsMaximized: boolean
  disclaimerVersionAccepted?: number
  disclaimerShouldSuppress: boolean
}

export const settingsDefaultState: SettingsState = {
  isAutorunEnabled: true,
  shouldFormatNumbers: true,
  isLogScale: true,
  areResultsMaximized: typeof window !== 'undefined' && window?.innerWidth > 2000,
  disclaimerVersionAccepted: undefined,
  disclaimerShouldSuppress: false,
}

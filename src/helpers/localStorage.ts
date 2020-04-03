export const LOCAL_STORAGE_KEYS = {
  AUTORUN_SIMULATION: 'autorun-simulation',
  LANG: 'lang',
  LOG_SCALE: 'log-scale',
  SHOW_HUMANIZED_RESULTS: 'show-humanized-results',
  SUPPRESS_DISCLAIMER: 'suppress-disclaimer',
  SKIP_LANDING_PAGE: 'skip-landing-page',
} as const

export const LOCAL_STORAGE_KEYS_DEFAULT_VALUES = {
  AUTORUN_SIMULATION: false,
  LANG: 'en',
  LOG_SCALE: false,
  SHOW_HUMANIZED_RESULTS: true,
  SUPPRESS_DISCLAIMER: { version: 0, suppressShowAgain: true },
  SKIP_LANDING_PAGE: false,
} as const

export type LocalStorageKey = typeof LOCAL_STORAGE_KEYS[keyof typeof LOCAL_STORAGE_KEYS]

function set<T>(key: LocalStorageKey, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

function get<T>(key: LocalStorageKey): T | null {
  const value = localStorage.getItem(key)
  try {
    return value !== null ? JSON.parse(value) : value
  } catch {
    return (value as unknown) as T
  }
}

export default { set, get }

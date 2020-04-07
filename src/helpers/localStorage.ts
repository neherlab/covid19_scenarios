export const LOCAL_STORAGE_KEYS = {
  AUTORUN_SIMULATION: 'autorun-simulation',
  LANG: 'lang',
  LOG_SCALE: 'log-scale',
  SHOW_HUMANIZED_RESULTS: 'show-humanized-results',
  SUPPRESS_DISCLAIMER: 'suppress-disclaimer',
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

export interface LocalStorageKeys {
  AUTORUN_SIMULATION: string
  LANG: string
  LOG_SCALE: string
  SHOW_HUMANIZED_RESULTS: string
  SUPPRESS_DISCLAIMER: string
}

export const LOCAL_STORAGE_KEYS: LocalStorageKeys = {
  AUTORUN_SIMULATION: 'autorun-simulation',
  LANG: 'lang',
  LOG_SCALE: 'log-scale',
  SHOW_HUMANIZED_RESULTS: 'show-humanized-results',
  SUPPRESS_DISCLAIMER: 'suppress-disclaimer',
}

function set<T>(key: string, value: T): void {
  localStorage.setItem(key, typeof value !== 'string' ? JSON.stringify(value) : value)
}

function get<T>(key: string): T | null {
  const value = localStorage.getItem(key)
  try {
    return value !== null ? JSON.parse(value) : value
  } catch {
    return (value as unknown) as T
  }
}

export default { LOCAL_STORAGE_KEYS, set, get }

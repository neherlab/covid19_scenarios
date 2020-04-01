import * as t from 'io-ts'
import { isLeft } from 'fp-ts/lib/Either'
import { PathReporter } from 'io-ts/lib/PathReporter'

export const LOCAL_STORAGE_KEYS = {
  AUTORUN_SIMULATION: 'autorun-simulation',
  LANG: 'lang',
  LOG_SCALE: 'log-scale',
  SHOW_HUMANIZED_RESULTS: 'show-humanized-results',
  SUPPRESS_DISCLAIMER: 'suppress-disclaimer',
  SKIP_LANDING_PAGE: 'skip-landing-page',
} as const

export type LocalStorageKey = typeof LOCAL_STORAGE_KEYS[keyof typeof LOCAL_STORAGE_KEYS]

export const LOCAL_STORAGE_TYPES = {
  'autorun-simulation': t.boolean,
  'lang': t.string,
  'log-scale': t.boolean,
  'show-humanized-results': t.boolean,
  'suppress-disclaimer': t.type({
    version: t.number,
    suppressShowAgain: t.boolean,
  }),
  'skip-landing-page': t.union([t.literal('true'), t.literal('false')]),
}

export type LocalStorageTypes = {
  [K in LocalStorageKey]: t.TypeOf<typeof LOCAL_STORAGE_TYPES[K]>
}

function set<K extends LocalStorageKey>(key: K, value: LocalStorageTypes[K]): void {
  const type: t.Mixed = LOCAL_STORAGE_TYPES[key]
  const encoded = type.encode(value)
  localStorage.setItem(key, JSON.stringify(encoded))
}

function get<K extends LocalStorageKey>(key: K): LocalStorageTypes[K] | null {
  const value = localStorage.getItem(key)
  if (value === null) {
    return null
  }

  let obj: unknown
  try {
    obj = JSON.parse(value)
  } catch {
    console.warn(`Unable to parse JSON from localStorage["${key}"]`)
    return null
  }

  // expanding type to t.Mixed due to union type issues
  const type: t.Mixed = LOCAL_STORAGE_TYPES[key]
  const result = type.decode(obj)

  if (isLeft(result)) {
    const errors = PathReporter.report(result)
    console.warn(`Found ${errors.length} error(s) while decoding localStorage["${key}"]: \n${errors.join('\n\n')}`)
    return null
  }

  // This is slightly type unsafe since I had to cast to t.Mixed making the typeof result.any === any
  return result.right
}

function remove(key: LocalStorageKey): void {
  localStorage.removeItem(key)
}

export default { set, get, remove }

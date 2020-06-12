export function getOrThrow<K extends string, V>(map: Map<K, V>, key: K): V {
  const value = map.get(key)
  if (!value) {
    throw new Error(`Value under key \`${key}\` was expected, but not found in the Map`)
  }
  return value
}

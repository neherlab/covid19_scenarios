import { map, zipObject } from 'lodash'

/**
 * Converts array of objects to an object of arrays ("Array of Structs" -> "Struct of Arrays" in olden terminology).
 * NOTE: The keys of the resulting object will be the same as in the *first* element of the input array.
 * NOTE: It will work properly with mismatched objects, but mostly only makes sense if all of the elements
 * of the input array are of the same shape and all properties are of the same type.
 */
export function soa<T extends { [key: string]: unknown }, K extends keyof T>(arr: T[]): { [key: string]: T[K][] } {
  if (arr.length === 0) {
    return {} as { [key: string]: T[K][] }
  }

  const keys = Object.keys(arr[0])
  const something = keys.map((key) => map(arr, key))
  return zipObject(keys, something) as { [key: string]: T[K][] }
}

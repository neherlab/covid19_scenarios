/* eslint-disable no-param-reassign */

/** Puts 3 given numbers in ascending order. Does not mutate arguments. */
export function sort3<T extends number>(a: T, b: T, c: T) {
  if (a > c) [a, c] = [c, a]
  if (a > b) [a, b] = [b, a]
  if (b > c) [b, c] = [c, b]
  return [a, b, c]
}

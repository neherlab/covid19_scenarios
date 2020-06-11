/** Puts 2 given numbers in ascending order. Does not mutate arguments. */
export function sort2<T extends number>([a, b]: [T, T]) {
  if (a < b) return [a, b]
  return [b, a]
}

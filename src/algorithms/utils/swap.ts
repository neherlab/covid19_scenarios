/** Swaps order of 2 values. Does not mutate arguments. */
export function swap<X, Y>(x: X, y: Y): [Y, X] {
  return [y, x]
}

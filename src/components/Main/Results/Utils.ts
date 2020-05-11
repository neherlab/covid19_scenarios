export type maybeNumber = number | undefined

export function verifyPositive(x: number): maybeNumber {
  return x > 0 ? Math.ceil(x) : undefined
}

export function verifyTuple(
  x: [number | undefined, number | undefined],
): [number | undefined, number | undefined] | undefined {
  if (x[0] !== undefined && x[1] !== undefined) {
    return x
  }
  if (x[0] === undefined && x[1] !== undefined) {
    return [0.0001, x[1]]
  }

  return undefined
}

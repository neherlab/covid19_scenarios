export type maybeNumber = number | undefined

export function verifyPositive(x: number): maybeNumber {
  return x > 0 ? Math.ceil(x) : undefined
}

export function verifyTuple(x: [maybeNumber, maybeNumber]): [number, number] | undefined {
  if (x[0] !== undefined && x[1] !== undefined) {
    return [x[0], x[1]]
  }
  if (x[0] === undefined && x[1] !== undefined) {
    return [0.0001, x[1]]
  }

  return undefined
}

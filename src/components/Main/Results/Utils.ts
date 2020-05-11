export type maybeNumber = number | undefined

export function verifyPositive(x: number): maybeNumber {
  return x > 0 ? Math.ceil(x) : undefined
}

/* eslint-disable no-bitwise */
/* tslint:disable:no-bitwise */

export function float64ToBigInt64(n: number): bigint {
  const buffer = new ArrayBuffer(Float64Array.BYTES_PER_ELEMENT)
  const view = new DataView(buffer)
  view.setFloat64(0, n, true)
  return view.getBigInt64(0, true)
}

export function signAndMagnitudeToBiased(sam: bigint): bigint {
  if (sam < 0) {
    return ~sam + 1n
  }
  return sam
}

export function absUlpDiff(a: number, b: number): bigint {
  /* If the numbers are the same, the diff is zero. */
  if (a === b) {
    return 0n
  }

  const biased1 = signAndMagnitudeToBiased(float64ToBigInt64(a))
  const biased2 = signAndMagnitudeToBiased(float64ToBigInt64(b))

  return biased1 >= biased2 ? biased1 - biased2 : biased2 - biased1
}

export function toBeCloseToUlp(a: number, b: number, maxULP: bigint): boolean {
  if (isNaN(a) || isNaN(b)) {
    return false
  }

  return absUlpDiff(a, b) < maxULP
}

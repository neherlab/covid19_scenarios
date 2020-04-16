export function float64ToBigInt64(n: number): bigint {
  const buffer = new ArrayBuffer(Float64Array.BYTES_PER_ELEMENT)
  const view = new DataView(buffer)
  view.setFloat64(0, n, true)
  return view.getBigInt64(0, true)
}

export function absUlpDiff(a: number, b: number): bigint {
  const diff = float64ToBigInt64(a) - float64ToBigInt64(b)
  return diff < 0n ? diff * -1n : diff
}

export function toBeCloseToUlp(a: number, b: number, maxULP: bigint): boolean {
  return absUlpDiff(a, b) < maxULP
}

import { NumericRangeNonNegative } from '../types/Param.types'

// TODO(nnoll): Generalize to allow for sampling multiple uncertainty ranges
export function sampleUniform({ begin, end }: NumericRangeNonNegative, npoints: number): number[] {
  const sample: number[] = []
  const delta = (end - begin) / npoints
  let val = begin
  while (sample.length < npoints) {
    sample.push(val)
    val += delta
  }
  return sample
}

export function sampleRandom(range: [number, number]): number {
  // tslint:disable-next-line insecure-random
  return (range[1] - range[0]) * Math.random() + range[0]
}

// TODO(nnoll): Generalize to allow for sampling multiple uncertainty ranges
export function sampleUniform(range: [number, number], npoints: number): number[] {
  const sample: number[] = []
  const delta = (range[1] - range[0]) / npoints
  let val = range[0]
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

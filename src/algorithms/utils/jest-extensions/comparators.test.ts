import { float64ToBigInt64, absUlpDiff } from './comparators'

describe('ULP float comparison', () => {
  it('difference between zero and zero is 0', () => {
    expect(absUlpDiff(0, 0)).toStrictEqual(0n)
  })

  it('difference between 1 and 1+epsilon is 1', () => {
    expect(absUlpDiff(1, 1 + Number.EPSILON)).toStrictEqual(1n)
  })

  it('integer representation of MIN_VALUE is 1', () => {
    expect(float64ToBigInt64(Number.MIN_VALUE)).toStrictEqual(1n)
  })

  it('compare 0.2 + 0.1', () => {
    expect(0.2 + 0.1).not.toEqual(0.3)
    expect(absUlpDiff(0.2 + 0.1, 0.3)).toStrictEqual(1n)
  })

  it('compare -0.2 + 0.3', () => {
    expect(-0.2 + 0.3).not.toEqual(0.1)
    expect(absUlpDiff(-0.2 + 0.3, 0.1)).toStrictEqual(2n)
  })
})

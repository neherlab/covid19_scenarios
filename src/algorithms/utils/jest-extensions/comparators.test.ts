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
})

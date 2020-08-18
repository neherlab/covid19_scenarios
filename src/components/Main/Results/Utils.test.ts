import { verifyPositive, verifyTuple, computeNewEmpiricalCases } from './Utils'

describe('verifyPositive', () => {
  it('integer greater than zero returns same integer', () => {
    expect(verifyPositive(312)).toStrictEqual(312)
  })

  it('number greater than zero returns rounded version', () => {
    expect(verifyPositive(312.2)).toStrictEqual(312)
  })

  it('zero returns undefined', () => {
    expect(verifyPositive(0)).toBeUndefined()
  })

  it('less than zero returns undefined', () => {
    expect(verifyPositive(-1)).toBeUndefined()
  })
})

describe('verifyTuple', () => {
  it('input [undefined, undefined] returns undefined', () => {
    expect(verifyTuple([undefined, undefined])).toBeUndefined()
  })

  it('input [a, undefined] returns undefined', () => {
    expect(verifyTuple([1, undefined])).toBeUndefined()
  })

  it('input [undefined, b] returns [0.0001, b]', () => {
    expect(verifyTuple([undefined, 2])).toStrictEqual([0.0001, 2])
  })

  it('input [a, b] returns [a,b]', () => {
    expect(verifyTuple([1, 2])).toStrictEqual([1, 2])
  })
})

describe('computeNewEmpiricalCases', () => {
  /* Note that this test presumes the 'time' field is not used by the computeNewEmpiricalCases */
  /* The assumption is correct at the time of writing, and exploited to make the test simpler. */
  /* But the time field must be present to keep the typescript compiler happy. */
  const time = new Date(0)
  const cumulativeCounts = [
    { cases: 1, time },
    { cases: 2, time },
    { cases: 4, time },
    { cases: 6, time },
    { cases: 6, time },
    { cases: 7, time },
  ]
  it('returns empty result if cumulativeCounts parameter is undefined.', () => {
    const got = computeNewEmpiricalCases(3, 'cases')
    expect(got).toStrictEqual([[], 3])
  })

  it('computes with a timeWindow of 1', () => {
    const [newEmpiricalCases, deltaDay] = computeNewEmpiricalCases(1, 'cases', cumulativeCounts)
    expect(newEmpiricalCases).toEqual([undefined, 1, 2, 2, undefined, 1])
    expect(deltaDay).toEqual(1)
  })

  it('computes with a timeWindow that evenly divides cumulativeCounts', () => {
    const [newEmpiricalCases, deltaDay] = computeNewEmpiricalCases(2, 'cases', cumulativeCounts)
    expect(newEmpiricalCases).toEqual([undefined, undefined, 3, 4, 2, 1])
    expect(deltaDay).toEqual(2)
  })

  it('computes with a timeWindow that does not evenly divide cumulativeCounts', () => {
    const [newEmpiricalCases, deltaDay] = computeNewEmpiricalCases(4, 'cases', cumulativeCounts)
    expect(newEmpiricalCases).toEqual([undefined, undefined, undefined, undefined, 5, 5])
    expect(deltaDay).toEqual(4)
  })
})

import { verifyPositive, verifyTuple } from './Utils'

describe('verifyPositive', () => {
  it('integer greater than zero returns same integer', () => {
    expect(verifyPositive(312)).toStrictEqual(312)
  })

  it('number greater than zero returns ceiled version', () => {
    expect(verifyPositive(312.2)).toStrictEqual(313)
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

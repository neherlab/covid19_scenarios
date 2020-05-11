import { verifyPositive } from './Utils'

describe('verifyPositive', () => {
  it('integer greater than zero returns same integer', () => {
    expect(verifyPositive(312)).toStrictEqual(312)
  })

  it('number greater than zero returns ceiled version', () => {
    expect(verifyPositive(312.2)).toStrictEqual(313)
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

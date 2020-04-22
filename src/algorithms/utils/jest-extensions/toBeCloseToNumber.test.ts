import { toBeCloseToNumber } from '.'

expect.extend({ toBeCloseToNumber })

describe('extension-test', () => {
  it('toBeCloseToNumber works as expected', () => {
    expect(1.2).toBeCloseToNumber(1.2 + Number.EPSILON * 2)
    expect(1.2).not.toBeCloseToNumber(1.2 + Number.EPSILON * 5)
  })
})

import { toBeCloseToArraySnapshot } from './jest-extensions'

expect.extend({ toBeCloseToArraySnapshot })

describe('extension-test', () => {
  it('matches snapshot array', () => {
    expect([1.234, 6.5542, 1.231, 999.99999]).toBeCloseToArraySnapshot(3)
  })
})

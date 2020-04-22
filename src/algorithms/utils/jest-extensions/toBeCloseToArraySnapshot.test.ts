import { toBeCloseToArraySnapshot } from '.'

expect.extend({ toBeCloseToArraySnapshot })

describe('extension-test', () => {
  it('matches snapshot of literal array', () => {
    expect([1.234, 6.5542, 1.231, 999.99999]).toBeCloseToArraySnapshot()
  })

  it('matches snapshot of computed array', () => {
    const computed = [...Array(10)].map((_, idx) => Math.PI * idx)
    expect(computed).toBeCloseToArraySnapshot()
  })
})

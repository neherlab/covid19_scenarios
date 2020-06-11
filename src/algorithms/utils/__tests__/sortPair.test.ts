import { sortPair } from '../sortPair'

describe('sortPair', () => {
  it('sorts already ordered', async () => {
    expect(sortPair([-5, 3.14])).toStrictEqual([-5, 3.14])
  })

  it('sorts any unordered numbers', async () => {
    expect(sortPair([3.14, -5])).toStrictEqual([-5, 3.14])
  })

  it('sorts equals: all', async () => {
    expect(sortPair([3.14, 3.14])).toStrictEqual([3.14, 3.14])
  })

  it('sorts equals: all zeros', async () => {
    expect(sortPair([0, 0])).toStrictEqual([0, 0])
  })

  it('does not mutate arguments', async () => {
    const a = 3.14
    const b = -5
    const [, ,] = sortPair([a, b])
    expect(a).toBe(3.14)
    expect(b).toBe(-5)
  })

  it('overwrites locals', async () => {
    let a = 3.14
    let b = -5
    ;[a, b] = sortPair([a, b])
    expect(a).toBe(-5)
    expect(b).toBe(3.14)
  })
})

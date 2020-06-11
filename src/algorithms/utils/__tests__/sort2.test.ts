import { sort2 } from '../sort2'

describe('sort2', () => {
  it('sorts already ordered', async () => {
    expect(sort2([-5, 3.14])).toStrictEqual([-5, 3.14])
  })

  it('sorts any unordered numbers', async () => {
    expect(sort2([3.14, -5])).toStrictEqual([-5, 3.14])
  })

  it('sorts equals: all', async () => {
    expect(sort2([3.14, 3.14])).toStrictEqual([3.14, 3.14])
  })

  it('sorts equals: all zeros', async () => {
    expect(sort2([0, 0])).toStrictEqual([0, 0])
  })

  it('does not mutate arguments', async () => {
    const a = 3.14
    const b = -5
    const [, ,] = sort2([a, b])
    expect(a).toBe(3.14)
    expect(b).toBe(-5)
  })

  it('overwrites locals', async () => {
    let a = 3.14
    let b = -5
    ;[a, b] = sort2([a, b])
    expect(a).toBe(-5)
    expect(b).toBe(3.14)
  })
})

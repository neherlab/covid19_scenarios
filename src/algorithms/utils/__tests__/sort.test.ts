import { sort } from '../sort'

describe('sort', () => {
  it('sorts already ordered', async () => {
    expect(sort(-5, 3.14, 42)).toStrictEqual([-5, 3.14, 42])
  })

  it('sorts any unordered numbers', async () => {
    expect(sort(3.14, -5, 42)).toStrictEqual([-5, 3.14, 42])
  })

  it('sorts equals: all', async () => {
    expect(sort(3.14, 3.14, 3.14)).toStrictEqual([3.14, 3.14, 3.14])
  })

  it('sorts equals: all zeros', async () => {
    expect(sort(0, 0, 0)).toStrictEqual([0, 0, 0])
  })

  it('sorts equals: left', async () => {
    expect(sort(42, 2, 2)).toStrictEqual([2, 2, 42])
  })

  it('sorts equals: sides', async () => {
    expect(sort(2, 42, 2)).toStrictEqual([2, 2, 42])
  })

  it('sorts equals: right', async () => {
    expect(sort(42, 42, 2)).toStrictEqual([2, 42, 42])
  })

  it('sorts: 1, 2, 3', async () => {
    expect(sort(1, 2, 3)).toStrictEqual([1, 2, 3])
  })

  it('sorts: 2, 1, 3', async () => {
    expect(sort(2, 1, 3)).toStrictEqual([1, 2, 3])
  })

  it('sorts: 1, 3, 2', async () => {
    expect(sort(1, 3, 2)).toStrictEqual([1, 2, 3])
  })

  it('sorts: 3, 1, 2', async () => {
    expect(sort(3, 1, 2)).toStrictEqual([1, 2, 3])
  })

  it('sorts: 3, 2, 1', async () => {
    expect(sort(3, 2, 1)).toStrictEqual([1, 2, 3])
  })

  it('does not mutate arguments', async () => {
    const a = -5
    const b = 3.14
    const c = 42
    const [, ,] = sort(c, a, b)
    expect(a).toBe(-5)
    expect(b).toBe(3.14)
    expect(c).toBe(42)
  })
})

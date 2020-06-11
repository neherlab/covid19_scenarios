import { swap } from '../swap'

describe('sort', () => {
  it('swaps numbers', async () => {
    expect(swap(1.1, 4)).toStrictEqual([4, 1.1])
  })

  it('swaps strings', async () => {
    expect(swap('hello', 'swap')).toStrictEqual(['swap', 'hello'])
  })

  it('swaps number and string', async () => {
    expect(swap('hello', 42)).toStrictEqual([42, 'hello'])
  })

  it('swaps undefined, without gaps', async () => {
    expect(swap(undefined, undefined)).toStrictEqual([undefined, undefined])
  })

  it('does not mutate arguments', async () => {
    const a = 'hello'
    const b = 42
    const [,] = swap(a, b)
    expect(a).toEqual('hello')
    expect(b).toEqual(42)
  })
})

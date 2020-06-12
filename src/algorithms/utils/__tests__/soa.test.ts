import { cloneDeep } from 'lodash'
import { soa } from '../soa'

describe('soa', () => {
  it('converts an empty array to an empty object', () => {
    expect(soa([])).toStrictEqual({})
  })

  it('converts a 1-element array', () => {
    expect(soa([{ foo: 42, bar: 3.14 }])).toStrictEqual({ foo: [42], bar: [3.14] })
  })

  it('converts a 2-element array', () => {
    expect(
      soa([
        { foo: 42, bar: 3.14 },
        { foo: 2.72, bar: -5 },
      ]),
    ).toStrictEqual({
      foo: [42, 2.72],
      bar: [3.14, -5],
    })
  })

  it('converts a 3-element array', () => {
    expect(
      soa([
        { foo: 42, bar: 3.14 },
        { foo: 2.72, bar: -5 },
        { foo: 0, bar: 7 },
      ]),
    ).toStrictEqual({
      foo: [42, 2.72, 0],
      bar: [3.14, -5, 7],
    })
  })

  it('converts a array of objects with properties of different types', () => {
    expect(
      soa([
        { foo: 42, bar: 'a' },
        { foo: 2.72, bar: 'b' },
        { foo: 0, bar: 'c' },
      ]),
    ).toStrictEqual({
      foo: [42, 2.72, 0],
      bar: ['a', 'b', 'c'],
    })
  })

  it('converts a array of objects of mixed types', () => {
    expect(
      soa([
        { foo: 'a', bar: 42 },
        { foo: 2.72, bar: { x: 5, y: -3 } },
        { foo: null, bar: false },
      ]),
    ).toStrictEqual({
      foo: ['a', 2.72, null],
      bar: [42, { x: 5, y: -3 }, false],
    })
  })

  it('preserves holes', () => {
    expect(
      soa([
        { foo: undefined, bar: 42 },
        { foo: undefined, bar: 98 },
        { foo: undefined, bar: 76 },
      ]),
    ).toStrictEqual({
      foo: [undefined, undefined, undefined],
      bar: [42, 98, 76],
    })
  })

  it('does not modify the arguments', () => {
    const data = [
      { foo: 'a', bar: 42 },
      { foo: 'b', bar: 98 },
      { foo: 'c', bar: 76 },
    ]

    const dataCopy = cloneDeep(data)
    soa(data)
    expect(data).toStrictEqual(dataCopy)
  })
})

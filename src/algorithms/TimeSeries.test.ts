import { uniformDatesBetween, makeTimeSeries, updateTimeSeries } from './TimeSeries'

const tMin = 1583013600000 // Tue Sep 01 2020 00:00:00 GMT+0300
const tMax = 1598907600000 // Tue Sep 01 2020 00:00:00 GMT+0300

describe('TimeSeries.ts', () => {
  it('uniformDatesBetween', () => {
    const res = uniformDatesBetween(tMin, tMax, 10)

    expect(res.length).toBe(10)

    expect(res).toEqual([
      new Date('2020-02-29T22:00:00.000Z'),
      new Date('2020-03-21T08:33:20.000Z'),
      new Date('2020-04-10T19:06:40.000Z'),
      new Date('2020-05-01T05:40:00.000Z'),
      new Date('2020-05-21T16:13:20.000Z'),
      new Date('2020-06-11T02:46:40.000Z'),
      new Date('2020-07-01T13:20:00.000Z'),
      new Date('2020-07-21T23:53:20.000Z'),
      new Date('2020-08-11T10:26:40.000Z'),
      new Date('2020-08-31T21:00:00.000Z'),
    ])
  })

  it('makeTimeSeries', () => {
    const dateRange = {
      tMin: new Date(tMin),
      tMax: new Date(tMax),
    }
    const res = makeTimeSeries(dateRange, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
    expect(res).toEqual([
      { t: new Date('2020-02-29T22:00:00.000Z'), y: 1 },
      { t: new Date('2020-03-21T08:33:20.000Z'), y: 1 },
      { t: new Date('2020-04-10T19:06:40.000Z'), y: 1 },
      { t: new Date('2020-05-01T05:40:00.000Z'), y: 1 },
      { t: new Date('2020-05-21T16:13:20.000Z'), y: 1 },
      { t: new Date('2020-06-11T02:46:40.000Z'), y: 1 },
      { t: new Date('2020-07-01T13:20:00.000Z'), y: 1 },
      { t: new Date('2020-07-21T23:53:20.000Z'), y: 1 },
      { t: new Date('2020-08-11T10:26:40.000Z'), y: 1 },
      { t: new Date('2020-08-31T21:00:00.000Z'), y: 1 },
    ])
  })
})

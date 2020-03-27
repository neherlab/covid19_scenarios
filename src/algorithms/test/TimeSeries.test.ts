import { uniformDatesBetween, makeTimeSeries, updateTimeSeries } from '../utils/TimeSeries'
import { interpolateTimeSeries } from '../run'

function compareTimeSeries(expected: { t: Date; y: number }[], result: { t: Date; y: number }[]) {
  expect(result).toHaveLength(expected.length)

  expected.forEach(({ t, y }, index) => {
    const { t: resultT, y: resultY } = result[index]
    expect(resultT).toStrictEqual(t)
    expect(resultY).toBeCloseTo(y)
  })
}

describe('TimeSeries', () => {
  const tMin = new Date('1970-10-01T00:00:00.000Z')
  const tMax = new Date('1971-02-01T00:00:00.000Z')

  // These are the expected values from uniformDatesBetween(tMin,tMax)
  const tBetween = [
    new Date('1970-10-31T18:00:00.000Z'),
    new Date('1970-12-01T12:00:00.000Z'),
    new Date('1971-01-01T06:00:00.000Z'),
  ]

  describe('uniformDatesBetween()', () => {
    it('returns an array of "n" uniformly spaced dates between "min" and "max", inclusive.', () => {
      const n = 5

      const result = uniformDatesBetween(tMin.getTime(), tMax.getTime(), n)

      expect(result).toBeArray()

      expect(result).toStrictEqual([tMin, ...tBetween, tMax])
    })
  })

  describe('makeTimeSeries()', () => {
    it('maps an array of length "n" values to an array of "n" uniform dates bracketed by the simulation time range.', () => {
      const simulationTimeRange = { tMin, tMax }

      const result = makeTimeSeries(simulationTimeRange, [1, 2, 3, 4, 5])

      expect(result).toBeArray()

      expect(result).toStrictEqual([
        { t: tMin, y: 1 },
        { t: tBetween[0], y: 2 },
        { t: tBetween[1], y: 3 },
        { t: tBetween[2], y: 4 },
        { t: tMax, y: 5 },
      ])
    })
  })

  describe('interpolateTimeSeries()', () => {
    it('if created using an empty vector, the interpolation function must throw', () => {
      expect(() => interpolateTimeSeries([])).toThrow()
    })

    it('if given a time less than tMin, the interpolation function returns the earliest timeseries "y" value.', () => {
      const simulationTimeRange = { tMin, tMax }
      const timeSeries = makeTimeSeries(simulationTimeRange, [1, 3, 2, 5, 4, 7])

      const result = interpolateTimeSeries(timeSeries)

      expect(result).toBeFunction()

      const earlier = new Date(tMin.getTime() - 1000)
      expect(result(earlier)).toBe(1)
    })

    it('if given a time greater than tMax, the interpolation function returns the oldest timeseries "y" value.', () => {
      const simulationTimeRange = { tMin, tMax }
      const timeSeries = makeTimeSeries(simulationTimeRange, [1, 3, 2, 5, 4, 7])

      const result = interpolateTimeSeries(timeSeries)

      expect(result).toBeFunction()

      const later = new Date(tMax.getTime() + 1000)
      expect(result(later)).toBe(7)
    })

    it('interpolation within the timerange occurs as expected.', () => {
      const simulationTimeRange = { tMin, tMax }
      const timeSeries = makeTimeSeries(simulationTimeRange, [1, 7, 10])

      const interpolator = interpolateTimeSeries(timeSeries)

      expect(interpolator).toBeFunction()

      /* Run the interpolator 10 times the [tMin,tMax] range, stepping
       * in intervals of 15 days */

      const intervalCount = 10
      const intervalSize = 15

      const result = [...new Array(intervalCount)].map((_, index) => {
        const date = new Date(Number(tMin))
        date.setDate(date.getDate() + intervalSize * index)
        return interpolator(date)
      })

      expect(result).toBeArrayOfSize(intervalCount)

      const expected = [
        1,
        2.6354594390679185,
        4.209836664611696,
        5.648965995858905,
        6.892037521792783,
        7.889772449043392,
        8.678773876200733,
        9.32431394905387,
        9.891684813683101,
        10,
      ]

      result.forEach((y, index) => {
        expect(y).toBeCloseTo(expected[index])
      })
    })
  })

  describe('updateTimeSeries()', () => {
    it('interpolates an existing TimeSeries with a new "y" vector.', () => {
      const simulationTimeRange = { tMin, tMax }
      const yVector = [3, 7, 11]
      const timeSeries = makeTimeSeries(simulationTimeRange, yVector)
      const n = 5

      /* Update the time series using the new 'n' value with same TimeRange. */
      const result = updateTimeSeries(simulationTimeRange, timeSeries, n)
      expect(result).toBeArrayOfSize(n).toMatchSnapshot()
    })

    it('interpolates an existing TimeSeries with a new TimeRange.', () => {
      const simulationTimeRange = { tMin, tMax }
      const yVector = [3, 7, 11]
      const timeSeries = makeTimeSeries(simulationTimeRange, yVector)

      /* Add/remove 5 days from tMin and tMax, respectively,
       * resulting in a TimeRange smaller by 10 days.
       */
      const newTMin = new Date(Number(tMin))
      newTMin.setDate(newTMin.getDate() + 5)
      const newTMax = new Date(Number(tMax))
      newTMax.setDate(newTMax.getDate() - 5)
      const newSimulationTimeRange = { tMin: newTMin, tMax: newTMax }

      /* Update the time series using the new TimeRange with same 'n' value */
      const result = updateTimeSeries(newSimulationTimeRange, timeSeries, yVector.length)

      expect(result).toBeArrayOfSize(yVector.length).toMatchSnapshot()
    })
  })
})

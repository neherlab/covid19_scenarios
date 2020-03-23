import { uniformDatesBetween, makeTimeSeries, updateTimeSeries } from '../utils/TimeSeries'
import { interpolateTimeSeries } from '../run'

describe('TimeSeries', () => {
  const tMin = new Date('1970-10-01T00:00:00.000Z')
  const tMax = new Date('1971-02-01T00:00:00.000Z')

  describe('uniformDatesBetween()', () => {
    it('returns an array of "n" uniformly spaced dates between "min" and "max", inclusive.', () => {
      const n = 5

      const result = uniformDatesBetween(tMin.getTime(), tMax.getTime(), n)

      expect(result).toBeArray()

      expect(result).toStrictEqual([
        tMin,
        new Date('1970-10-31T18:00:00.000Z'),
        new Date('1970-12-01T12:00:00.000Z'),
        new Date('1971-01-01T06:00:00.000Z'),
        tMax,
      ])
    })
  })

  describe('makeTimeSeries()', () => {
    it('maps an array of length "n" values to an array of "n" uniform dates bracketed by the simulation time range.', () => {
      const simulationTimeRange = { tMin, tMax }

      const result = makeTimeSeries(simulationTimeRange, [1, 2, 3, 4, 5])

      expect(result).toBeArray()

      expect(result).toStrictEqual([
        { t: tMin, y: 1 },
        { t: new Date('1970-10-31T18:00:00.000Z'), y: 2 },
        { t: new Date('1970-12-01T12:00:00.000Z'), y: 3 },
        { t: new Date('1971-01-01T06:00:00.000Z'), y: 4 },
        { t: tMax, y: 5 },
      ])
    })
  })

  describe('interpolateTimeSeries()', () => {
    it('if created using an empty vector, the interpolation function must always yield 1.0', () => {
      const result = interpolateTimeSeries([])

      expect(result).toBeFunction()

      expect(result(tMin)).toBeCloseTo(1.0)

      expect(result(tMax)).toBeCloseTo(1.0)
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

      /* Compare the interpolated values to the expected values. */
      const expected = [
        1,
        2.4634146341463414,
        3.930894308943089,
        5.39430894308943,
        6.857723577235772,
        7.6605691056910565,
        8.392276422764228,
        9.1239837398374,
        9.855691056910569,
        10,
      ]

      expect(result).toHaveLength(intervalCount)

      expected.forEach((value, index) => {
        expect(value).toBeCloseTo(result[index])
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

      expect(result).toHaveLength(n)

      const expected = [
        { t: tMin, y: yVector[0] },
        { t: new Date('1970-10-31T18:00:00.000Z'), y: 5 },
        { t: new Date('1970-12-01T12:00:00.000Z'), y: 7 },
        { t: new Date('1971-01-01T06:00:00.000Z'), y: 9 },
        { t: tMax, y: yVector[2] },
      ]

      expected.forEach(({ t, y }, index) => {
        const { t: resultT, y: resultY } = result[index]
        expect(t).toStrictEqual(resultT)
        expect(y).toBeCloseTo(resultY)
      })
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

      expect(result).toHaveLength(yVector.length)

      const expected = [
        { t: new Date('1970-10-06T00:00:00.000Z'), y: 3.3252032520325203 },
        { t: new Date('1970-12-01T12:00:00.000Z'), y: 7 },
        { t: new Date('1971-01-27T00:00:00.000Z'), y: 10.67479674796748 },
      ]

      expected.forEach(({ t, y }, index) => {
        const { t: resultT, y: resultY } = result[index]
        expect(t).toStrictEqual(resultT)
        expect(y).toBeCloseTo(resultY)
      })
    })
  })
})

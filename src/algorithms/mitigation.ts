import { clamp } from 'lodash'
import { TimeSeries } from './types/TimeSeries.types'
import { MitigationInterval } from './types/Param.types'
import { sampleRandom } from './utils/sample'

// -----------------------------------------------------------------------
// Utility functions

function trypush(arr: undefined | number[], val: number): number[] {
  if (arr !== undefined) {
    arr.push(val)
    return arr
  }
  return [val]
}

// -----------------------------------------------------------------------
// Internal functions

interface MitigationMeasure {
  val: number
  tMin: number
  tMax: number
}

function strength(mitigation: number): number {
  return clamp(1 - mitigation / 100, 0.01, 1)
}

function sampleMitigationRealizations(
  intervals: MitigationInterval[],
  numberStochasticRuns: number,
  meanOnly: boolean,
): MitigationMeasure[][] {
  if (meanOnly) {
    return [
      intervals.map((interval) => ({
        val: strength(0.5 * (interval.transmissionReduction.begin + interval.transmissionReduction.end)),
        tMin: interval.timeRange.begin.valueOf(),
        tMax: interval.timeRange.end.valueOf(),
      })),
    ]
  }

  const noRanges = intervals.every(
    (interval) => interval.transmissionReduction.begin === interval.transmissionReduction.end,
  )
  if (noRanges) {
    return [
      intervals.map((interval) => ({
        val: strength(interval.transmissionReduction.begin),
        tMin: interval.timeRange.begin.valueOf(),
        tMax: interval.timeRange.end.valueOf(),
      })),
    ]
  }

  return [...Array(numberStochasticRuns).keys()].map(() =>
    intervals.map((interval) => ({
      val: strength(sampleRandom(interval.transmissionReduction)),
      tMin: interval.timeRange.begin.valueOf(),
      tMax: interval.timeRange.end.valueOf(),
    })),
  )
}

function timeSeriesOf(measures: MitigationMeasure[]): TimeSeries {
  const changePoints: Record<number, number[]> = {}
  measures.forEach((measure) => {
    const { val, tMin, tMax } = measure
    changePoints[tMin] = trypush(changePoints[tMin], val)
    changePoints[tMax] = trypush(changePoints[tMax], 1.0 / val)
  })

  const orderedChangePoints = Object.entries(changePoints)
    .map(([t, vals]) => ({
      t: Number(t),
      val: vals,
    }))
    .sort((a, b): number => a.t - b.t)

  if (orderedChangePoints.length > 0) {
    const mitigation: TimeSeries = [{ t: orderedChangePoints[0].t, y: 1.0 }]

    orderedChangePoints.forEach((d, i) => {
      const oldValue = mitigation[2 * i].y
      const newValue = d.val.reduce((a, b) => a * b, oldValue)

      mitigation.push({ t: d.t, y: oldValue })
      mitigation.push({ t: d.t, y: newValue })
    })

    return mitigation
  }

  return []
}

// NOTE: Assumes containment is sorted ascending in time.
type Func = (t: number) => number
function interpolateTimeSeries(containment: TimeSeries): Func {
  if (containment.length === 0) {
    return () => 1.0
  }

  const Ys = containment.map((d) => d.y)
  const Ts = containment.map((d) => d.t)
  return (t: number) => {
    if (t <= containment[0].t) {
      return containment[0].y
    }
    if (t >= containment[containment.length - 1].t) {
      return containment[containment.length - 1].y
    }
    const i = containment.findIndex((d) => t < d.t)

    const evalLinear = (t: number) => {
      const deltaY = Ys[i] - Ys[i - 1]
      const deltaT = Ts[i] - Ts[i - 1]

      const dS = deltaY / deltaT
      const dT = t - Ts[i - 1]

      return Ys[i - 1] + dS * dT
    }

    return evalLinear(t)
  }
}

// -----------------------------------------------------------------------
// Exported functions

export function containmentMeasures(
  intervals: MitigationInterval[],
  numberStochasticRuns: number,
  meanOnly: boolean,
): Func[] {
  return sampleMitigationRealizations(intervals, numberStochasticRuns, meanOnly).map((sample) =>
    interpolateTimeSeries(timeSeriesOf(sample)),
  )
}

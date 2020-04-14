import { clamp } from 'lodash'
import { TimeSeries } from './types/TimeSeries.types'
import { MitigationIntervals } from './types/Param.types'

function intervalsToTimeSeries(intervals: MitigationIntervals): TimeSeries[] {
  const changePoints: Record<number, number[]> = {}
  intervals.forEach((element) => {
    // bound the value by 0.01 and 100 (transmission can be at most 100 fold reduced or increased)
    const val = clamp(1 - element.mitigationValue[0] / 100, 0.01, 100)
    const tMin = element.timeRange.tMin.valueOf()
    const tMax = element.timeRange.tMax.valueOf()

    if (changePoints[tMin] !== undefined) {
      changePoints[tMin].push(val)
    } else {
      changePoints[tMin] = [val]
    }
    // add inverse of the value when measure is relaxed
    if (changePoints[tMax] !== undefined) {
      changePoints[tMax].push(1.0 / val)
    } else {
      changePoints[tMax] = [1.0 / val]
    }
  })

  const orderedChangePoints = Object.entries(changePoints)
    .map(([t, vals]) => ({
      t: Number(t),
      val: vals,
    }))
    .sort((a, b): number => a.t - b.t)

  if (orderedChangePoints.length > 0) {
    const mitigationSeries: TimeSeries = [{ t: orderedChangePoints[0].t, y: 1.0 }]

    orderedChangePoints.forEach((d, i) => {
      const oldValue = mitigationSeries[2 * i].y
      const newValue = d.val.reduce((a, b) => a * b, oldValue)

      mitigationSeries.push({ t: d.t, y: oldValue })
      mitigationSeries.push({ t: d.t, y: newValue })
    })

    return [mitigationSeries]
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

export function sampleContainmentMeasures(intervals: MitigationIntervals): Func[] {
  return intervalsToTimeSeries(intervals).map((ts) => interpolateTimeSeries(ts))
}

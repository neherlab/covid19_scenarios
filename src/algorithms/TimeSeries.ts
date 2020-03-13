import * as d3 from 'd3'

import { DateRange } from './Param.types'

interface TimePoint {
  t: Date
  y: number
}

export type TimeSeries = TimePoint[]

export function uniformDatesBetween(
  min: number,
  max: number,
  n: number,
): Date[] {
  const d = (max - min) / (n - 1)
  const dates = d3.range(min, max + d, d)
  return dates.map(d => new Date(d))
}

export function makeTimeSeries(
  simulationTimeRange: DateRange,
  values: number[],
): TimeSeries {
  const { tMin, tMax } = simulationTimeRange
  const n = values.length

  const dates = uniformDatesBetween(tMin.getTime(), tMax.getTime(), n)

  const tSeries = []
  for (let i = 0; i < n; i++) {
    tSeries.push({ t: dates[i], y: values[i] })
  }

  return tSeries
}

export function timeSeriesToReduction(timeSeries: TimeSeries): number[] {
  return timeSeries.map(timePoint => timePoint.y)
}

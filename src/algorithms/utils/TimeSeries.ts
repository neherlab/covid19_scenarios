import * as d3 from 'd3'

import { DateRange } from '../types/Param.types'
import { interpolateTimeSeries } from '../run'
import { TimeSeries } from '../types/TimeSeries.types'

export function uniformDatesBetween(min: number, max: number, n: number): Date[] {
  const d     = (max - min) / (n - 1)
  const dates = d3.range(min, max + d, d).filter((_, i) => i < n);
  return dates.map(d => new Date(d))
}

export function makeTimeSeries(simulationTimeRange: DateRange, values: number[]): TimeSeries {
  const { tMin, tMax } = simulationTimeRange
  const n = values.length

  const dates = uniformDatesBetween(tMin.getTime(), tMax.getTime(), n)

  const tSeries = []
  for (let i = 0; i < n; i++) {
    tSeries.push({ t: dates[i], y: values[i] })
  }

  return tSeries
}


export function updateTimeSeries(simulationTimeRange: DateRange, oldTimeSeries: TimeSeries, n: number): TimeSeries {
  const { tMin, tMax } = simulationTimeRange
  const interpolator = interpolateTimeSeries(oldTimeSeries)

  const dates = uniformDatesBetween(tMin.getTime(), tMax.getTime(), n)
  const newTimeSeries: TimeSeries = dates.map(d => ({t: d, y: interpolator(d)}))

  return newTimeSeries
}

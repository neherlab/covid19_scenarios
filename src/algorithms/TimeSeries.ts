import * as d3 from 'd3'

interface TimePoint {
  t: Date
  y: number
}

export type TimeSeries = TimePoint[]

export function uniformDatesBetween(min, max, n) {
  const d = (max - min) / (n - 1)
  const dates = d3.range(Number(min), Number(max) + d, d)
  return dates.map(d => new Date(d))
}

export function makeTimeSeries(
  tMin: Date,
  tMax: Date,
  values: number[],
): TimeSeries {
  const dates = uniformDatesBetween(tMin, tMax, values.length)
  const tSeries = []
  for (let i = 0; i < values.length; i++) {
    tSeries.push({ t: dates[i], y: values[i] })
  }
  return tSeries
}

export function timeSeriesToReduction(timeSeries: TimeSeries) {
  return timeSeries.map(timePoint => timePoint.y)
}

import * as t from 'io-ts'
import { DateType } from './Date.types'

export const TimePointType = t.type({
  t: DateType,
  y: t.number,
})

export const TimeSeriesType = t.array(TimePointType)

export type TimePoint = t.TypeOf<typeof TimePointType>

export type TimeSeries = t.TypeOf<typeof TimeSeriesType>

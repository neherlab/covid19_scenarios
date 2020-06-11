/* eslint-disable no-param-reassign */

import { pickBy, mapValues } from 'lodash'
import { isNumeric, max, min } from 'mathjs'

import type { Trajectory, PlotDatum } from './types/Result.types'
import { MaybeNumber } from '../components/Main/Results/Utils'

import { sortPair } from './utils/sortPair'
// import { linesToPlot, areasToPlot, DATA_POINTS } from '../components/Main/Results/ChartCommon'

export function takePositiveValues<T extends { [key: string]: number }>(obj: T) {
  return pickBy(obj, (value) => value > 0) as T
}

export function roundValues<T extends { [key: string]: number }>(obj: T) {
  return mapValues(obj, Math.round)
}

export function verifyPositive(x: number): MaybeNumber {
  const xRounded = Math.round(x)
  return xRounded > 0 ? xRounded : undefined
}

export function verifyTuple([low, mid, upp]: [MaybeNumber, MaybeNumber, MaybeNumber]): [number, number] | undefined {
  low = verifyPositive(low ?? 0)
  mid = verifyPositive(mid ?? 0)
  upp = verifyPositive(upp ?? 0)

  if (isNumeric(low) && isNumeric(upp) && isNumeric(mid)) {
    return [min(low, mid), max(mid, upp)]
  }

  if (isNumeric(low) && isNumeric(upp)) {
    return [low, upp]
  }

  if (!isNumeric(low) && isNumeric(upp) && isNumeric(mid)) {
    return [0.0001, max(mid, upp)]
  }

  if (!isNumeric(low) && isNumeric(upp)) {
    return [0.0001, upp]
  }

  return undefined
}

export function verifyTuples<T extends { [key: string]: MaybeNumber[] }>(obj: T) {
  return mapValues(obj, (x) => verifyTuple(x))
}

export function preparePlotData(trajectory: Trajectory): PlotDatum[] {
  const { lower, middle, upper } = trajectory

  return middle.map((_0, day) => {
    const previousDay = day > 6 ? day - 7 : 0

    const weeklyFatalityMiddle = middle[day].cumulative.fatality.total - middle[previousDay].cumulative.fatality.total // prettier-ignore
    let weeklyFatalityLower  = lower[day].cumulative.fatality.total  - lower[previousDay].cumulative.fatality.total // prettier-ignore
    let weeklyFatalityUpper  = upper[day].cumulative.fatality.total  - upper[previousDay].cumulative.fatality.total // prettier-ignore

    ;[weeklyFatalityLower, weeklyFatalityUpper] = sortPair([weeklyFatalityLower, weeklyFatalityUpper]) // prettier-ignore

    let lines = {
      susceptible: middle[day].current.susceptible.total,
      infectious: middle[day].current.infectious.total,
      severe: middle[day].current.severe.total,
      critical: middle[day].current.critical.total,
      overflow: middle[day].current.overflow.total,
      recovered: middle[day].cumulative.recovered.total,
      fatality: middle[day].cumulative.fatality.total,
      weeklyFatality: weeklyFatalityMiddle,
    }

    lines = takePositiveValues(lines)
    lines = roundValues(lines)

    const areasRaw = {
      susceptible:    [ lower[day].current.susceptible.total,  middle[day].current.susceptible.total,   upper[day].current.susceptible.total  ], // prettier-ignore
      infectious:     [ lower[day].current.infectious.total,   middle[day].current.infectious.total,    upper[day].current.infectious.total   ], // prettier-ignore
      severe:         [ lower[day].current.severe.total,       middle[day].current.severe.total,        upper[day].current.severe.total       ], // prettier-ignore
      critical:       [ lower[day].current.critical.total,     middle[day].current.critical.total,      upper[day].current.critical.total     ], // prettier-ignore
      overflow:       [ lower[day].current.overflow.total,     middle[day].current.overflow.total,      upper[day].current.overflow.total     ], // prettier-ignore
      recovered:      [ lower[day].cumulative.recovered.total, middle[day].cumulative.recovered.total,  upper[day].cumulative.recovered.total ], // prettier-ignore
      fatality:       [ lower[day].cumulative.fatality.total,  middle[day].cumulative.fatality.total,   upper[day].cumulative.fatality.total  ], // prettier-ignore
      weeklyFatality: [ weeklyFatalityLower,                   weeklyFatalityMiddle,                    weeklyFatalityUpper                   ] // prettier-ignore
    }

    const areas = verifyTuples(areasRaw)

    return { time: middle[day].time, lines, areas }
  })
}

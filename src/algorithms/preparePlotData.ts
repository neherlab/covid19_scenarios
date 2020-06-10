import { pickBy, mapValues } from 'lodash'

import type { Trajectory, PlotDatum } from './types/Result.types'
import { verifyPositive, verifyTuple } from '../components/Main/Results/Utils'
// import { linesToPlot, areasToPlot, DATA_POINTS } from '../components/Main/Results/ChartCommon'

export function filterPositiveValues<T extends { [key: string]: number }>(obj: T) {
  return pickBy(obj, (value) => value > 0) as T
}

export function roundValues<T extends { [key: string]: number }>(obj: T) {
  return mapValues(obj, verifyPositive) as T
}

export function preparePlotData(trajectory: Trajectory): PlotDatum[] {
  const { lower, middle, upper } = trajectory

  return middle.map((x, day) => {
    const previousDay = day > 6 ? day - 7 : 0
    const centerWeeklyDeaths = x.cumulative.fatality.total - middle[previousDay].cumulative.fatality.total

    // NOTE: this is using the upper and lower trajectories
    const extremeWeeklyDeaths1 = upper[day].cumulative.fatality.total - upper[previousDay].cumulative.fatality.total
    const extremeWeeklyDeaths2 = lower[day].cumulative.fatality.total - lower[previousDay].cumulative.fatality.total
    const upperWeeklyDeaths = extremeWeeklyDeaths1 > extremeWeeklyDeaths2 ? extremeWeeklyDeaths1 : extremeWeeklyDeaths2
    const lowerWeeklyDeaths = extremeWeeklyDeaths1 > extremeWeeklyDeaths2 ? extremeWeeklyDeaths2 : extremeWeeklyDeaths1

    let lines = {
      susceptible: x.current.susceptible.total,
      infectious: x.current.infectious.total,
      severe: x.current.severe.total,
      critical: x.current.critical.total,
      overflow: x.current.overflow.total,
      recovered: x.cumulative.recovered.total,
      fatality: x.cumulative.fatality.total,
      weeklyFatality: centerWeeklyDeaths,
    }

    lines = filterPositiveValues(lines)
    lines = roundValues(lines)

    return {
      time: x.time,
      lines,
      areas: {
        susceptible: verifyTuple(
          [verifyPositive(lower[day].current.susceptible.total), verifyPositive(upper[day].current.susceptible.total)],
          x.current.susceptible.total,
        ),
        infectious: verifyTuple(
          [verifyPositive(lower[day].current.infectious.total), verifyPositive(upper[day].current.infectious.total)],
          x.current.infectious.total,
        ),
        severe: verifyTuple(
          [verifyPositive(lower[day].current.severe.total), verifyPositive(upper[day].current.severe.total)],
          x.current.severe.total,
        ),
        critical: verifyTuple(
          [verifyPositive(lower[day].current.critical.total), verifyPositive(upper[day].current.critical.total)],
          x.current.critical.total,
        ),
        overflow: verifyTuple(
          [verifyPositive(lower[day].current.overflow.total), verifyPositive(upper[day].current.overflow.total)],
          x.current.overflow.total,
        ),
        recovered: verifyTuple(
          [
            verifyPositive(lower[day].cumulative.recovered.total),
            verifyPositive(upper[day].cumulative.recovered.total),
          ],
          x.cumulative.recovered.total,
        ),
        fatality: verifyTuple(
          [verifyPositive(lower[day].cumulative.fatality.total), verifyPositive(upper[day].cumulative.fatality.total)],
          x.cumulative.fatality.total,
        ),
        weeklyFatality: verifyTuple(
          [verifyPositive(lowerWeeklyDeaths), verifyPositive(upperWeeklyDeaths)],
          x.cumulative.fatality.total - middle[previousDay].cumulative.fatality.total,
        ),
      },
    }
  })
}

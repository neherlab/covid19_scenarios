import type { Trajectory, PlotDatum } from './types/Result.types'
import { verifyPositive, verifyTuple } from '../components/Main/Results/Utils'
// import { linesToPlot, areasToPlot, DATA_POINTS } from '../components/Main/Results/ChartCommon'

export function preparePlotData(trajectory: Trajectory): PlotDatum[] {
  const { lower, middle, upper } = trajectory
  return middle.map((x, day) => {
    return {
      time: x.time,
      lines: {
        susceptible: verifyPositive(x.current.susceptible.total),
        infectious: verifyPositive(x.current.infectious.total),
        severe: verifyPositive(x.current.severe.total),
        critical: verifyPositive(x.current.critical.total),
        overflow: verifyPositive(x.current.overflow.total),
        recovered: verifyPositive(x.cumulative.recovered.total),
        fatality: verifyPositive(x.cumulative.fatality.total),
        weeklyFatality: verifyPositive(x.current.weeklyFatality.total),
      },
      // Error bars
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
          [
            verifyPositive(lower[day].current.weeklyFatality.total),
            verifyPositive(upper[day].current.weeklyFatality.total),
          ],
          x.current.weeklyFatality.total,
        ),
      },
    }
  })
}

import type { Trajectory, PlotDatum } from './types/Result.types'
import { verifyPositive, verifyTuple } from '../components/Main/Results/Utils'
// import { linesToPlot, areasToPlot, DATA_POINTS } from '../components/Main/Results/ChartCommon'

export function preparePlotData(trajectory: Trajectory): PlotDatum[] {
  const { lower, middle, upper } = trajectory

  return middle.map((x, i) => ({
    time: x.time,
    lines: {
      susceptible: verifyPositive(x.current.susceptible.total),
      infectious: verifyPositive(x.current.infectious.total),
      severe: verifyPositive(x.current.severe.total),
      critical: verifyPositive(x.current.critical.total),
      overflow: verifyPositive(x.current.overflow.total),
      recovered: verifyPositive(x.cumulative.recovered.total),
      fatality: verifyPositive(x.cumulative.fatality.total),
    },
    // Error bars
    areas: {
      susceptible: verifyTuple(
        [verifyPositive(lower[i].current.susceptible.total), verifyPositive(upper[i].current.susceptible.total)],
        x.current.susceptible.total,
      ),
      infectious: verifyTuple(
        [verifyPositive(lower[i].current.infectious.total), verifyPositive(upper[i].current.infectious.total)],
        x.current.infectious.total,
      ),
      severe: verifyTuple(
        [verifyPositive(lower[i].current.severe.total), verifyPositive(upper[i].current.severe.total)],
        x.current.severe.total,
      ),
      critical: verifyTuple(
        [verifyPositive(lower[i].current.critical.total), verifyPositive(upper[i].current.critical.total)],
        x.current.critical.total,
      ),
      overflow: verifyTuple(
        [verifyPositive(lower[i].current.overflow.total), verifyPositive(upper[i].current.overflow.total)],
        x.current.overflow.total,
      ),
      recovered: verifyTuple(
        [verifyPositive(lower[i].cumulative.recovered.total), verifyPositive(upper[i].cumulative.recovered.total)],
        x.cumulative.recovered.total,
      ),
      fatality: verifyTuple(
        [verifyPositive(lower[i].cumulative.fatality.total), verifyPositive(upper[i].cumulative.fatality.total)],
        x.cumulative.fatality.total,
      ),
    },
  }))
}

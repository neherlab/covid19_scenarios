import { UserResult, ExportedTimePoint } from '../types/Result.types'
import { PlotData, DATA_POINTS } from '../../components/Main/Results/DeterministicLinePlot'

// These are the columns we got from currently exported files.
// They my not be present in the user results.
enum RawUserResultColumn {
  Time = 'time',
  Susceptible = 'susceptible',
  Severe = 'severe',
  Exposed =  'exposed',
  Overflow = 'overflow',
  ICU = 'ICU',
  Infectious = 'infectious',
  CumulativeRecovered =  'cumulative_recovered',
  CumulativeHospitalized = 'cumulative_hospitalized',
  CumulativeCritical = 'cumulative_critical',
  CumulativeFatality = 'cumulative_fatality',
}

function formatData(rawData: string): Record<string, number> | undefined {
  return rawData ? { total: +rawData } : undefined
}

export default function processUserResult(rawUserResult: Record<RawUserResultColumn, string>[]): UserResult {
  const trajectory: ExportedTimePoint[] = []

  for (const row of rawUserResult) {
    if (!row.time) {
      // TODO surface an error to the user when we ignore a row
      continue
    }

    trajectory.push({
      time: +new Date(row.time),
      cumulative: {
        critical: formatData(row.cumulative_critical),
        fatality: formatData(row.cumulative_fatality),
        hospitalized: formatData(row.cumulative_hospitalized),
        recovered: formatData(row.cumulative_recovered),
      },
      current: {
        exposed: formatData(row.exposed),
        infectious: formatData(row.infectious),
        overflow: formatData(row.overflow),
        severe: formatData(row.severe),
        susceptible: formatData(row.susceptible),
        critical: formatData(row.ICU),
      },
    })
  }

  return { trajectory }
}

// TODO fix these UserResult data holding a Record<string, number> with just a 'total' record
export function userResultToPlot(enabledPlots: DATA_POINTS[], userResult?: UserResult): PlotData[] {
  if (!userResult) {
    // This should not happen as the UI shouldn't allow the option if no data have been imported
    throw new Error('No data imported')
  }

  return userResult.trajectory.map((dataPoint: ExportedTimePoint) => ({
    time: dataPoint.time,
    cases: enabledPlots.includes(DATA_POINTS.ObservedCases)
      ? dataPoint.current.infectious?.total || undefined
      : undefined,
    observedDeaths: enabledPlots.includes(DATA_POINTS.ObservedDeaths)
      ? dataPoint.cumulative.fatality?.total || undefined
      : undefined,
    currentHospitalized: enabledPlots.includes(DATA_POINTS.ObservedHospitalized)
      ? dataPoint.current.severe?.total || undefined
      : undefined,
    ICU: enabledPlots.includes(DATA_POINTS.ObservedICU) ? dataPoint.current.critical?.total || undefined : undefined,
  }))
}

import { SimulationTimePoint, UserResult } from './Result.types'

export default function processUserResult(rawUserResult: string[]): UserResult {
  console.log({ rawUserResult })

  // These are the columns we got from currently exported files.
  // They my not be present in the user results.
  const columns = [
    'time',
    'susceptible',
    'exposed',
    'infectious',
    'hospitalized',
    'critical',
    'discharged',
    'recovered',
    'dead',
  ]

  // TODO: Parse trajectores, `throw` on errors
  const trajectory: SimulationTimePoint[] = []

  return { trajectory }
}

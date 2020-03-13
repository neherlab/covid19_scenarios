import { SimulationTimePoint, UserResult } from './Result.types'

export default function processUserResult(rawUserResult: string[]): UserResult {
  console.log({ rawUserResult })

  // These are the columns we got from currently exported files.
  // They may not be present in the user results.
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
  const header = rawUserResult[0];
  function parseRow(row: string[], idx: number[]) {
    if (idx){
      const newRow: SimulationTimePoint = {};
      header.forEach((d,i) => {
        try {
          if (d === 'time'){
            newRow[d] = new Date(row[i]);
          } else if (columns.find(d) >= 0){
            newRow[d] = parseFloat(row[i]);
          }
        } catch (e) {
          console.error(e);
        }
      })
      trajectory.push(newRow);
    }
  }
  rawUserResult.forEach(parseRow);
  console.log('parsed trajectory', trajectory)

  return { trajectory }
}

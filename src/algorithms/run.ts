import { CountryAgeDistribution } from '../assets/data/CountryAgeDistribution.types'
import { SeverityTableRow } from '../components/Main/SeverityTable'
import { AllParams } from './Param.types'
import { AlgorithmResult } from './Result.types'

/**
 *
 * Entry point for the algorithm
 *
 */
export default async function run(
  params: AllParams,
  severity: SeverityTableRow[],
  countryAgeDistribution: CountryAgeDistribution,
): Promise<AlgorithmResult> {
  console.log(JSON.stringify({ params }, null, 2))
  // console.log(JSON.stringify({ severity }, null, 2))
  // console.log(JSON.stringify({ countryAgeDistribution }, null, 2))

  // TODO: run the actual algorithm

  // TODO: return the actual result
  return { hello: 'world' }
}

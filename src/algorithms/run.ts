import * as math from 'mathjs'
import random from 'random'

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

  // DELETEME BEGIN: examples
  //
  // `mathjs` example:
  //
  // https://mathjs.org/docs/index.html
  //
  // const a = math.matrix([1, 4, 9, 16, 25])
  // const b = math.matrix(math.ones([2, 3]))
  // const d = [
  //   [1, 2],
  //   [3, 4],
  // ]
  // const e = math.matrix([
  //   [5, 6],
  //   [1, 1],
  // ])
  // const f = math.multiply(d, e)
  // console.log(math.format(b.size()))
  // console.log(math.format(f, 14))
  //
  //
  // `random` example
  //
  // https://www.npmjs.com/package/random
  //
  // random.float(0, 1)
  // random.int(0, 1)
  // random.boolean()
  // random.normal(0, 1)
  // random.bernoulli(0.5)
  //
  // DELETEME END

  // TODO: return the actual result
  return { hello: 'world' }
}

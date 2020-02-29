import { AllParams } from './Param.types'
import { AlgorithmResult } from './Result.types'

export default async function run(values: AllParams): Promise<AlgorithmResult> {
  console.log(JSON.stringify({ values }, null, 2))
  return { hello: 'world' }
}

import { readJSON, writeJSON } from 'fs-extra'
import yargs from 'yargs'
import { inspect } from 'util'

import type { Shareable, ScenarioFlat } from '../src/algorithms/types/Param.types'
import { toInternal } from '../src/algorithms/types/convert'
import { run } from '../src/algorithms/run'

async function main() {
  const { argv } = yargs
    .options({
      scenario: { type: 'string', demandOption: true, describe: 'Path to scenario parameters JSON file.' },
      out: { type: 'string', demandOption: true, describe: 'Path to output file.' },
    })
    .help()
    .version(false)
    .alias('h', 'help')

  const data: Shareable = await readJSON(argv.scenario)
  const { scenarioData, ageDistributionData, severityDistributionData } = data

  const scenario = toInternal(scenarioData.data)
  const params: ScenarioFlat = {
    ...scenario.population,
    ...scenario.epidemiological,
    ...scenario.simulation,
    ...scenario.mitigation,
  }

  const result = await run({
    params,
    severity: severityDistributionData.data,
    ageDistribution: ageDistributionData.data,
  })

  const whatToWrite = result.R0
  console.info(inspect(whatToWrite, { colors: true, depth: null }))
  writeJSON(argv.out, whatToWrite)
}

main()

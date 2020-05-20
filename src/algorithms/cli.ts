/* eslint-disable no-console, unicorn/no-process-exit */
import * as fs from 'fs'
import { run } from './run'
import { ScenarioFlat, ScenarioData } from './types/Param.types'
import { getAgeDistribution } from '../components/Main/state/getAgeDistribution'
import { getSeverityDistribution } from '../components/Main/state/getSeverityDistribution'
import { toInternal } from '../components/Main/state/getScenario'

const handleRejection: NodeJS.UnhandledRejectionListener = (err) => {
  console.error(err)
  process.exit(1)
}

process.on('unhandledRejection', handleRejection)

function readJsonFromFile<T>(arg: number) {
  const inputFilename = process.argv[arg]
  if (!inputFilename) {
    usage()
  }
  console.log(`Reading data from file ${inputFilename}`)
  const inputData = fs.readFileSync(inputFilename, 'utf8')
  const inputJson = JSON.parse(inputData) as T
  console.log(`Read input data`)
  return inputJson
}

async function main() {
  const scenarioData = readJsonFromFile<ScenarioData>(2)
  const outputFile = process.argv[3]
  if (!outputFile) {
    usage()
  }
  console.log(`Will write model output to ${outputFile}`)

  const scenario = toInternal(scenarioData.data)

  const params: ScenarioFlat = {
    ...scenario.population,
    ...scenario.epidemiological,
    ...scenario.simulation,
    ...scenario.mitigation,
  }
  // Read data from severityDistributions.json and perform JSON validation.
  // Use the model's default (and only) severity distribution.
  console.log(`Reading severity distribution data`)
  const DEFAULT_SEVERITY_DISTRIBUTION = 'China CDC'
  const severity = getSeverityDistribution(DEFAULT_SEVERITY_DISTRIBUTION)
  // Read data from ageDistribution.json and perform JSON validation.
  console.log(`Reading age distribution data`)
  const ageDistribution = getAgeDistribution(params.ageDistributionName)

  try {
    console.log('Running the model')
    const result = await run({ params, severity, ageDistribution })
    console.log('Run complete')
    console.log(result)
    console.log(`Writing output to ${outputFile}`)
    fs.writeFileSync(outputFile, JSON.stringify(result))
  } catch (error) {
    console.error(`Run failed: ${error}`)
    process.exit(1)
  }
}

function usage() {
  console.log(
    `
Usage:
    cli <input-file> <output-file>
        Manually perform a single model run with the given input, writing the results to the given output file.
    `.trim(),
  )

  process.exit(1)
}

main()

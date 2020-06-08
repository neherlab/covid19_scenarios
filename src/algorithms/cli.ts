/* eslint-disable no-console, unicorn/no-process-exit */
import * as fs from 'fs'
import * as yargs from 'yargs'

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

/**
 * Read a file in JSON format.
 *
 * @param inputFilename The path to the file.
 */
function readJsonFromFile<T>(inputFilename: string) {
  console.log('Reading data from file ' + inputFilename)
  const inputData = fs.readFileSync(inputFilename, 'utf8')
  const inputJson = JSON.parse(inputData) as T
  return inputJson
}

/**
 * Get severity distribution data. If a file is specified on the command
 * line, give priority to its contents, else load a default distribution.
 *
 * @param inputFilename The path to the file.
 */
function getSeverity(inputFilename: string | undefined) {
  if (inputFilename) {
    const data = readJsonFromFile<any>(inputFilename)
    return data.data
  }
  else {
    const DEFAULT_SEVERITY_DISTRIBUTION = 'China CDC'
    return getSeverityDistribution(DEFAULT_SEVERITY_DISTRIBUTION)
  }
}

/**
 * Get age distribution data. If a file is specified on the command
 * line, give priority to its contents, else load the distribution
 * name as specified in the scenario parameters.
 *
 * @param inputFilename The path to the file.
 * @param name The age distribution name to use if no file is
 *             specified.
 */
function getAge(inputFilename: string | undefined, name: string) {
  if (inputFilename) {
    const data = readJsonFromFile<any>(inputFilename)
    return data.data
  }
  else {
    return getAgeDistribution(name)
  }
}

async function main() {
  // Command line argument processing.
  const argv = yargs.options({
    scenario: {type: 'string', demandOption: true,
               describe: 'Path to scenario parameters JSON file.'},
    age:      {type: 'string',
               describe: 'Path to age distribution JSON file.'},
    severity: {type: 'string',
               describe: 'Path to severity JSON file.'},
    out:      {type: 'string', demandOption: true,
               describe: 'Path to output file.'},
  })
    .help()
    .version(false)
    .alias('h', 'help')
    .argv

  // Read the scenario data.
  const scenarioData = readJsonFromFile<ScenarioData>(argv.scenario)
  const scenario = toInternal(scenarioData.data)
  const params: ScenarioFlat = {
     ...scenario.population,
     ...scenario.epidemiological,
     ...scenario.simulation,
     ...scenario.mitigation,
  }

  // Load severity and age data.
  const severity = getSeverity(argv.severity)
  const ageDistribution = getAge(argv.age, params.ageDistributionName)

  // Run the model.
  try {
    const outputFile = argv.out
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

main()

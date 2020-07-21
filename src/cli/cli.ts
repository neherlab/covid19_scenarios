/* eslint-disable no-console, unicorn/no-process-exit,@typescript-eslint/restrict-template-expressions,@typescript-eslint/no-floating-promises */
import fs from 'fs-extra'
import yargs from 'yargs'
import neodoc from 'neodoc'

import { DEFAULT_SEVERITY_DISTRIBUTION } from '../constants'

import { run } from '../algorithms/run'
import { getAgeDistributionData } from '../io/defaults/getAgeDistributionData'
import { getSeverityDistributionData } from '../io/defaults/getSeverityDistributionData'

import type { ScenarioFlat, ScenarioData, SeverityDistributionData, AgeDistributionData } from '../algorithms/types/Param.types'
import { toInternal } from '../algorithms/types/convert'

const handleRejection: NodeJS.UnhandledRejectionListener = (err) => {
  console.error(err)
  process.exit(1)
}

process.on('unhandledRejection', handleRejection)

async function runSimulation({ params, severity, ageDistribution }){
  return await run({ params, severity, ageDistribution })
}

/**
 * Read a file in JSON format.
 *
 * @param inputFilename The path to the file.
 */
function readJsonFromFile<T>(inputFilename: string) {
  console.info(`Reading data from file ${inputFilename}`)
  const inputData = fs.readJsonSync(inputFilename, 'utf8')
  return inputData
}

/**
 * Get severity distribution data. If a file is specified on the command
 * line, give priority to its contents, else load a default distribution.
 *
 * @param inputFilename The path to the file.
 */
function getSeverity(inputFilename: string | undefined) {
  if (inputFilename) {
    const data = readJsonFromFile<SeverityDistributionData>(inputFilename)
    return data.data
  }

  return getSeverityDistributionData(DEFAULT_SEVERITY_DISTRIBUTION).data
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
    const data = readJsonFromFile<AgeDistributionData>(inputFilename)
    return data.data
  }

  return getAgeDistributionData(name).data
}

async function main() {
  // Command line argument processing.
  const argv = neodoc.run(`
    usage: cli <scenario> <output> [options]
    
    options:
      <scenario>            Path to scenario parameters JSON file
      <output>              Path to output file
      --age <path>          Path to age distribution JSON file
      --severity <path>     Path to severity JSON file
    `, { smartOptions: true })
  
  // Read the scenario data.
  const scenarioData = readJsonFromFile<ScenarioData>(argv['<scenario>'])
  const scenario = toInternal(scenarioData.data)
  const params: ScenarioFlat = {
    ...scenario.population,
    ...scenario.epidemiological,
    ...scenario.simulation,
    ...scenario.mitigation,
  }

  // Load severity and age data.
  const severity = getSeverity(argv['<severity>'])
  const ageDistribution = getAge(argv['<age>'], params.ageDistributionName)

  // Run the model.
  try {
    const outputFile = argv['<output>']
    console.info('Running the model')
    const result = await runSimulation({ params, severity, ageDistribution })
    console.info('Run complete')
    // console.info(result)
    console.info(`Writing output to ${outputFile}`)
    fs.writeFileSync(outputFile, JSON.stringify(result))
  } catch (error) {
    console.error(`Run failed: ${error}`)
    process.exit(1)
  }
}

main()

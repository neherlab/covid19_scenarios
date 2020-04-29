import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { StrictOmit } from 'ts-essentials'

import { State } from '../../components/Main/state/state'

import type { SeverityDistributionDatum } from '../types/Param.types'
import type { AlgorithmResult } from '../types/Result.types'

import { serialize } from '../../components/Main/state/serialize'

import { serializeTrajectory } from '../model'

export const FILENAME_PARAMS = 'c19s.params.json'
export const FILENAME_RESULTS_SUMMARY = 'c19s.results.summary.tsv'
export const FILENAME_RESULTS_DETAILED = 'c19s.results.detailed.tsv'
export const FILENAME_ZIP = 'c19s.zip'

export class ExportErrorBlobApiNotSupported extends Error {
  constructor() {
    super('Error: when exporting: `Blob()` API is not supported by this browser')
  }
}

export class ExportErrorResultsInvalid extends Error {
  public result?: AlgorithmResult

  constructor(result?: AlgorithmResult) {
    super('Error: when exporting: algorithm results are invalid')
    this.result = result
  }
}

export function checkBlobSupport() {
  try {
    return !!new Blob()
  } catch (error) {
    throw new ExportErrorBlobApiNotSupported()
  }
}

export function saveFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  saveAs(blob, filename)
}

export interface ExportResultsParams {
  scenarioState: State
  result?: AlgorithmResult
  detailed: boolean
}

export function exportResult({ scenarioState, result, detailed }: ExportResultsParams) {
  checkBlobSupport()

  const trajectory = result?.trajectory
  if (!result || !trajectory) {
    throw new ExportErrorResultsInvalid(result)
  }

  const str = serializeTrajectory({ trajectory, detailed })
  saveFile(str, FILENAME_RESULTS_DETAILED)
}

export interface ExportScenarioParams {
  scenarioState: State
  severity: SeverityDistributionDatum[]
  severityName: string
}

export function exportScenario({ scenarioState, severity, severityName }: ExportScenarioParams) {
  checkBlobSupport()

  const str = serialize({
    scenario: scenarioState.data,
    scenarioName: scenarioState.current,
    ageDistribution: scenarioState.ageDistribution,
    ageDistributionName: scenarioState.data.population.ageDistributionName,
    severity,
    severityName,
  })

  saveFile(str, FILENAME_PARAMS)
}

export type ExportAllParams = StrictOmit<ExportScenarioParams & ExportResultsParams, 'detailed'>

export async function exportAll({ scenarioState, severity, severityName, result }: ExportAllParams) {
  checkBlobSupport()

  const trajectory = result?.trajectory
  if (!result || !trajectory) {
    throw new ExportErrorResultsInvalid(result)
  }

  const paramStr = serialize({
    scenario: scenarioState.data,
    scenarioName: scenarioState.current,
    ageDistribution: scenarioState.ageDistribution,
    ageDistributionName: scenarioState.data.population.ageDistributionName,
    severity,
    severityName,
  })

  const summaryStr = serializeTrajectory({ trajectory, detailed: false })
  const detailedStr = serializeTrajectory({ trajectory, detailed: true })

  const zip = new JSZip()
  zip.file(FILENAME_PARAMS, paramStr)
  zip.file(FILENAME_RESULTS_SUMMARY, summaryStr)
  zip.file(FILENAME_RESULTS_DETAILED, detailedStr)

  const zipFile = await zip.generateAsync({ type: 'blob' })
  saveAs(zipFile, FILENAME_ZIP)
}

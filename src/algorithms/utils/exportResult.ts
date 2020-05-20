import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { StrictOmit } from 'ts-essentials'

import { State } from '../../components/Main/state/state'

import type { SeverityDistributionDatum } from '../types/Param.types'
import type { AlgorithmResult } from '../types/Result.types'

import { serialize } from '../../components/Main/state/serialization/serialize'

import { serializeTrajectory } from '../model'

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
  } catch {
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
  filename: string
}

export function exportResult({ scenarioState, result, detailed, filename }: ExportResultsParams) {
  checkBlobSupport()

  const trajectory = result?.trajectory
  if (!result || !trajectory) {
    throw new ExportErrorResultsInvalid(result)
  }

  const str = serializeTrajectory({ trajectory, detailed })
  saveFile(str, filename)
}

export interface ExportScenarioParams {
  scenarioState: State
  severity: SeverityDistributionDatum[]
  severityName: string
  filename: string
}

export function exportScenario({ scenarioState, severity, severityName, filename }: ExportScenarioParams) {
  checkBlobSupport()

  const str = serialize({
    scenario: scenarioState.data,
    scenarioName: scenarioState.current,
    ageDistribution: scenarioState.ageDistribution,
    ageDistributionName: scenarioState.data.population.ageDistributionName,
    severity,
    severityName,
  })

  saveFile(str, filename)
}

export interface Filenames {
  filenameParams: string
  filenameResultsSummary: string
  filenameResultsDetailed: string
  filenameZip: string
}

export type ExportAllParams = StrictOmit<
  ExportScenarioParams & ExportResultsParams & Filenames,
  'detailed' | 'filename'
>

export async function exportAll({
  scenarioState,
  severity,
  severityName,
  result,
  filenameParams,
  filenameResultsSummary,
  filenameResultsDetailed,
  filenameZip,
}: ExportAllParams) {
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
  zip.file(filenameParams, paramStr)
  zip.file(filenameResultsSummary, summaryStr)
  zip.file(filenameResultsDetailed, detailedStr)

  const zipFile = await zip.generateAsync({ type: 'blob' })
  saveAs(zipFile, filenameZip)
}

import JSZip from 'jszip'
import { saveAs } from 'file-saver'

import type { StrictOmit } from 'ts-essentials'
import type { ScenarioParameters } from '../types/Param.types'
import type { AlgorithmResult } from '../types/Result.types'

import { serialize } from '../../io/serialization/serialize'
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
  scenarioParameters: ScenarioParameters
  result?: AlgorithmResult
  detailed: boolean
  filename: string
}

export function exportResult({ scenarioParameters, result, detailed, filename }: ExportResultsParams) {
  checkBlobSupport()

  const trajectory = result?.trajectory
  if (!result || !trajectory) {
    throw new ExportErrorResultsInvalid(result)
  }

  const str = serializeTrajectory({ trajectory, detailed })
  saveFile(str, filename)
}

export interface ExportScenarioParams {
  scenarioParameters: ScenarioParameters
  filename: string
}

export function exportScenario({ scenarioParameters, filename }: ExportScenarioParams) {
  checkBlobSupport()
  const str = serialize(scenarioParameters)
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
  scenarioParameters,
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

  const paramStr = serialize(scenarioParameters)
  const summaryStr = serializeTrajectory({ trajectory, detailed: false })
  const detailedStr = serializeTrajectory({ trajectory, detailed: true })

  const zip = new JSZip()
  zip.file(filenameParams, paramStr)
  zip.file(filenameResultsSummary, summaryStr)
  zip.file(filenameResultsDetailed, detailedStr)

  const zipFile = await zip.generateAsync({ type: 'blob' })
  saveAs(zipFile, filenameZip)
}

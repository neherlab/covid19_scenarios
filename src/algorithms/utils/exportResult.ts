import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { AllParams } from '../types/Param.types'
import { AlgorithmResult } from '../types/Result.types'
import { exportSimulation } from '../model'

export function isBlobApiSupported() {
  try {
    return !!new Blob()
  } catch (error) {
    return false
  }
}

export function saveFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  saveAs(blob, filename)
}

export async function exportAll(params: AllParams, result: AlgorithmResult) {
  if (!result) {
    throw new Error(`Algorithm result expected, but got ${result}`)
  }

  const { trajectory } = result

  if (!(trajectory || params)) {
    console.error('Error: the results, and params, of the simulation cannot be exported')
    return
  }

  const zip = new JSZip()

  if (!params) {
    console.error('Error: the params of the simulation cannot be exported because they are null')
  } else {
    zip.file('covid.params.json', JSON.stringify(params, null, 2))
  }

  if (!trajectory) {
    console.error('Error: the results of the simulation cannot be exported because they are nondeterministic')
  } else {
    zip.file('covid.results.deterministic.tsv', exportSimulation(trajectory))
  }

  const zipFile = await zip.generateAsync({ type: 'blob' })
  saveAs(zipFile, 'covid.params.results.zip')
}

export function exportResult(result: AlgorithmResult) {
  if (!result) {
    throw new Error(`Algorithm result expected, but got ${result}`)
  }

  const { trajectory } = result

  if (!isBlobApiSupported()) {
    // TODO: Display an error popup
    console.error('Error: export is not supported in this browser: `Blob()` API is not implemented')
    return
  }

  if (!trajectory) {
    console.error('Error: the results of the simulation cannot be exported because they are nondeterministic')
    return
  }

  saveFile(exportSimulation(trajectory), 'covid.results.deterministic.tsv')
}

export function exportParams(params: AllParams) {
  if (!params) {
    throw new Error(`Algorithm params expected, but got ${params}`)
  }

  if (!isBlobApiSupported()) {
    // TODO: Display an error popup
    console.error('Error: export is not supported in this browser: `Blob()` API is not implemented')
    return
  }

  if (!params) {
    console.error('Error: the params of the simulation cannot be exported because they are null')
    return
  }

  saveFile(JSON.stringify(params, null, 2), 'covid.params.json')
}

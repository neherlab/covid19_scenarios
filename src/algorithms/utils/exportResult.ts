import { saveAs } from 'file-saver'

import { exportSimulation } from '../model'

import { AlgorithmResult } from '../types/Result.types'

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

export function exportResult(result: AlgorithmResult) {
  if (!result) {
    throw new Error(`Algorithm result expected, but got ${result}`)
  }

  if (!isBlobApiSupported()) {
    // TODO: Display an error popup
    console.error('Error: export is not supported in this browser: `Blob()` API is not implemented')
    return
  }

  const { deterministic, params } = result

  if (deterministic) {
    const tsvString: string = exportSimulation(deterministic)
    saveFile(tsvString, 'covid.results.deterministic.tsv')
  }

  if (params) {
    saveFile(JSON.stringify(params, null, 2), 'covid.params.json')
  }
}

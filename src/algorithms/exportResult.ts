import { saveAs } from 'file-saver'

import { exportSimulation } from './model'

import { AlgorithmResult } from './Result.types'

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

  const { deterministicTrajectory, stochasticTrajectories, params } = result

  if (deterministicTrajectory) {
    const csvString: string = exportSimulation(deterministicTrajectory)
    saveFile(csvString, 'covid.results.deterministic.csv')
  }

  if (params) {
    saveFile(JSON.stringify(params, null, 2), 'covid.params.json')
  }
}

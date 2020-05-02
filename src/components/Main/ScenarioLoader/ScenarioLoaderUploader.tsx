import React from 'react'

import type { AnyAction } from 'typescript-fsa'

import type { SeverityDistributionDatum } from '../../../algorithms/types/Param.types'

import { readFile } from '../../../helpers/readFile'

import { setStateData } from '../state/actions'
import { deserialize } from '../state/serialize'

import { ScenarioLoaderUploadZone } from './ScenarioLoaderUploadZone'

export interface ScenarioLoaderUploaderProps {
  close(): void
  setSeverity(severity: SeverityDistributionDatum[]): void
  scenarioDispatch(action: AnyAction): void
}

export function ScenarioLoaderUploader({ scenarioDispatch, setSeverity, close }: ScenarioLoaderUploaderProps) {
  async function processParamJson(file: File) {
    const str = await readFile(file)
    const params = deserialize(str)

    if (!params) {
      throw new Error('Failed to deserialize parameters from JSON file')
    }

    scenarioDispatch(
      setStateData({
        current: params.scenarioName,
        data: params.scenario,
        ageDistribution: params.ageDistribution,
      }),
    )

    setSeverity(params.severity)

    close()
  }

  async function onDrop(files: File[], filesRejected: File[]) {
    const nFiles = files.length + filesRejected.length

    if (nFiles > 1) {
      throw new Error(`Only one file is expected`)
    }

    if (files.length !== 1) {
      throw new Error(`Upload failed`)
    }

    await processParamJson(files[0])
  }

  return <ScenarioLoaderUploadZone onDrop={onDrop} />
}

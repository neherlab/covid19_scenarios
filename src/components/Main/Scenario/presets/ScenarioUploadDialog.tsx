import React from 'react'

import type { AnyAction } from 'typescript-fsa'

import type { SeverityDistributionDatum } from '../../../../algorithms/types/Param.types'

import { readFile } from '../../../../helpers/readFile'

import { setStateData } from '../../state/actions'
import { deserialize } from '../../state/serialize'

import FileUploadZone from './FileUploadZone'

export interface ScenarioUploadDialogProps {
  setSeverity(severity: SeverityDistributionDatum[]): void
  scenarioDispatch(action: AnyAction): void
}

function ScenarioUploadDialog({ scenarioDispatch, setSeverity }: ScenarioUploadDialogProps) {
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
  }

  async function onDrop(files: File[]) {
    if (files.length > 0) {
      await processParamJson(files[0])
    }
  }

  return <FileUploadZone onDrop={onDrop} />
}

export { ScenarioUploadDialog }

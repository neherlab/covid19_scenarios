import React from 'react'

import type { AnyAction } from 'typescript-fsa'

import type { SeverityDistributionDatum } from '../../../algorithms/types/Param.types'

import { readFile } from '../../../helpers/readFile'

import { setStateData } from '../state/actions'
import { deserialize } from '../state/serialize'

import { ScenarioLoaderCustomUploadZone } from './ScenarioLoaderCustomUploadZone'

export interface ScenarioLoaderCustomProps {
  setSeverity(severity: SeverityDistributionDatum[]): void
  scenarioDispatch(action: AnyAction): void
}

export function ScenarioLoaderCustom({ scenarioDispatch, setSeverity }: ScenarioLoaderCustomProps) {
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

  return <ScenarioLoaderCustomUploadZone onDrop={onDrop} />
}

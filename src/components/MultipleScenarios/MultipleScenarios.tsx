import React from 'react'

import Main from '../Main/Main'
import { ModelParams } from '../../algorithms/types/Result.types'

function onScenarioSave(name: string, params?: ModelParams) {
  console.log(name, params)
}

export default function MultipleScenarios() {
  return <Main onScenarioSave={onScenarioSave} />
}

import { ScenarioData, EmpiricalData, AllParams } from '../../../algorithms/types/Param.types'
import { AlgorithmResult } from '../../../algorithms/types/Result.types'
import { SeverityTableRow } from '../Scenario/SeverityTable'
import { string } from 'prop-types'
import { defaultScenarioState } from './state'

export interface SavedScenario {
  name: string
  creationTime: string
  creator: string
  url: string
}
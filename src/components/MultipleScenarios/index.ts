import { State } from '../Main/state/state'
import { SeverityTableRow } from '../Main/Scenario/SeverityTable'
import { AlgorithmResult } from '../../algorithms/types/Result.types'

export interface Scenario {
  id: string
  userid: string
  name: string
  params: null | ScenarioParams
  result?: null | AlgorithmResult
}

export interface ScenarioParams {
  scenarioState: State
  severity: SeverityTableRow[]
}

export interface SavedScenario {
  id: string
  userid: string
  name: string
  params: null | ScenarioParams
}

export interface SavedScenariosState {
  version: number
  scenarios: SavedScenario[]
}

export const DEFAULT_SCENARIO_ID = 'customize'

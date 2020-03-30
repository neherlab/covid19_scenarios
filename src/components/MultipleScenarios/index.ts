import { State } from '../Main/state/state'
import { SeverityTableRow } from '../Main/Scenario/SeverityTable'

export interface Scenario {
  id: string
  userid: string
  name: string
  params: null | ScenarioParams
  result?: null
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

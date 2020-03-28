import type { AllParams } from '../../../algorithms/types/Param.types'
import { State } from './state'
import { SeverityTableRow } from '../Scenario/SeverityTable'

export function serializeScenario(scenarioState: State, params: AllParams, severity: SeverityTableRow[]) {
  const toSave = {
    version: 1,
    payload: {
      // mimic what is saved by URLSerializer and add the severity table
      ...params,
      current: {
        overall: scenarioState.overall.current,
        population: scenarioState.population.current,
        epidemiological: scenarioState.epidemiological.current,
        containment: scenarioState.containment.current,
      },
      containment: scenarioState.containment.data.reduction,
    },
  }

  return btoa(JSON.stringify(toSave))
}

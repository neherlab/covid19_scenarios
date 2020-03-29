import type { AllParams } from '../../../algorithms/types/Param.types'
import { State } from './state'
import { SeverityTableRow } from '../Scenario/SeverityTable'

export function serializeScenario(scenarioState: State, severity: SeverityTableRow[]) {
  const toSave = {
    version: 1,
    payload: {
      current: scenarioState.current,
      data: scenarioState.data,
    },
  }

  return btoa(JSON.stringify(toSave))
}

export function deserializeScenario(serialized: string, initState: State): State {
  try {
    const obj = JSON.parse(atob(serialized)).payload
    obj.scenarios = initState.scenarios

    // Be careful of dates object that have been serialized to string
    obj.data.simulation.simulationTimeRange.tMin = new Date(obj.data.simulation.simulationTimeRange.tMin)
    obj.data.simulation.simulationTimeRange.tMax = new Date(obj.data.simulation.simulationTimeRange.tMax)
    obj.data.containment.reduction = obj.data.containment.reduction.map((c: { t: string; y: number }) => ({
      y: c.y,
      t: new Date(c.t),
    }))

    return obj
  } catch (error) {
    console.error('Error deserializing:', error.message)
  }

  return initState
}

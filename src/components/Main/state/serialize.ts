import { State } from './state'
import { SeverityTableRow } from '../Scenario/SeverityTable'

export function serializeScenario(scenarioState: State, severity: SeverityTableRow[]) {
  const toSave = {
    version: 1,
    payload: {
      scenarioState: {
        current: scenarioState.current,
        data: scenarioState.data,
      },
      severity,
    },
  }

  return btoa(JSON.stringify(toSave))
}

export function deserializeScenario(
  serialized: string,
  initialScenarioState: State,
  severityDefaults: SeverityTableRow[],
): { scenarioState: State; severity: SeverityTableRow[] } {
  try {
    const obj = JSON.parse(atob(serialized)).payload

    const { scenarioState, severity } = obj

    scenarioState.scenarios = initialScenarioState.scenarios

    // Be careful of dates that have been serialized to string
    scenarioState.data.simulation.simulationTimeRange.tMin = new Date(
      scenarioState.data.simulation.simulationTimeRange.tMin,
    )
    scenarioState.data.simulation.simulationTimeRange.tMax = new Date(
      scenarioState.data.simulation.simulationTimeRange.tMax,
    )
    scenarioState.data.containment.reduction = scenarioState.data.containment.reduction.map(
      (c: { t: string; y: number }) => ({
        y: c.y,
        t: new Date(c.t),
      }),
    )

    return { scenarioState, severity }
  } catch (error) {
    console.error('Error deserializing:', error.message)
  }

  return { scenarioState: initialScenarioState, severity: severityDefaults }
}

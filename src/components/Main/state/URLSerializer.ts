import type { AllParams } from '../../../algorithms/types/Param.types'

import { State } from './state'
import { SeverityTableRow, SeverityTableNumberFields } from '../Scenario/SeverityTable'

/*

Quick and dirty helper to serialize/deserialize parameters within the URL, 
so people can share/save it and keep their parameters

This could have been done inside a redux middleware, but with some refacto.

We use JSON.stringify to serialize things out. It's not the most optimized way at all,
but it works, and it's simple enough. Note that Date object is serialized as a string,
so some extra work is needed during deserialization.

*/

export async function serializeScenarioToURL(scenarioState: State, severity: SeverityTableRow[], params: AllParams) {
  const toSave = {
    ...params,
    current: scenarioState.current,
    containment: scenarioState.data.containment.reduction,
    severity,
  }

  window.history.pushState('', '', `?${encodeURIComponent(JSON.stringify(toSave))}`)
}

export function deserializeScenarioFromURL(initState: State): State {
  if (window.location.search) {
    try {
      /*
        We deserialise the URL by removing the first char ('?'), and applying JSON.parse 
      */
      const obj = JSON.parse(decodeURIComponent(window.location.search.slice(1)))

      // Be careful of dates object that have been serialized to string

      // safe to mutate here
      obj.simulation.simulationTimeRange.tMin = new Date(obj.simulation.simulationTimeRange.tMin)
      obj.simulation.simulationTimeRange.tMax = new Date(obj.simulation.simulationTimeRange.tMax)

      const containmentDataReduction = obj.containment.map((c: { t: string; y: number }) => ({
        y: c.y,
        t: new Date(c.t),
      }))

      return {
        ...initState,
        current: obj.current,
        data: {
          population: initState.data.population,
          containment: {
            reduction: containmentDataReduction,
            numberPoints: containmentDataReduction.length,
          },
          epidemiological: initState.data.epidemiological,
          simulation: obj.simulation,
        },
      }
    } catch (error) {
      console.error('Error while parsing URL :', error.message)
    }
  }
  return initState
}

export function deserializeSeverityFromURL(severityDefaults: SeverityTableRow[]): SeverityTableRow[] {
  if (window.location.search) {
    try {
      /*
        We deserialise the URL by removing the first char ('?'), and applying JSON.parse 
      */
      const { severity } = JSON.parse(decodeURIComponent(window.location.search.slice(1)))

      if (!severity) {
        return severityDefaults
      }

      // prettier-ignore
      severity.forEach((row: SeverityTableRow) => {
        ['id', 'population', 'confirmed', 'severe', 'critical', 'fatal', 'totalFatal', 'isolated'].forEach(
          (fieldName) => {
            if (fieldName in row) {
              // eslint-disable-next-line no-param-reassign
              row[fieldName as SeverityTableNumberFields] = parseInt(
                `${row[fieldName as SeverityTableNumberFields]}`,
                10,
              )
            }
          },
        )
        // eslint-disable-next-line no-param-reassign
        delete row.errors
      })

      return severity
    } catch (error) {
      console.error('Error while parsing URL :', error.message)
    }
  }
  return severityDefaults
}

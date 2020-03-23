import { AllParams } from '../../../algorithms/types/Param.types'

import { State } from './state'

/*

Quick and dirty helper to serialize/deserialize parameters within the URL,
so people can share/save it and keep their parameters

This could have been done inside a redux middleware, but with some refacto.

We use JSON.stringify to serialize things out. It's not the most optimized way at all,
but it works, and it's simple enough. Note that Date object is serialized as a string,
so some extra work is needed during deserialization.

*/

export async function serializeScenarioToURL(scenarioState: State, params: AllParams) {
  const toSave = {
    ...params,
    current: {
      overall: scenarioState.overall.current,
      population: scenarioState.population.current,
      epidemiological: scenarioState.epidemiological.current,
      containment: scenarioState.containment.current,
    },
    containment: scenarioState.containment.data.reduction,
  }

  window.history.pushState('', '', `?${encodeURIComponent(JSON.stringify(toSave))}`)
}

export function deserializeScenarioFromURL(initState: State) {
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
        overall: { ...initState.overall, current: obj.current.overall },
        population: { ...initState.population, current: obj.current.population, data: obj.population },
        epidemiological: {
          ...initState.epidemiological,
          current: obj.current.epidemiological,
          data: obj.epidemiological,
        },
        containment: {
          ...initState.containment,
          current: obj.current.containment,
          data: { reduction: containmentDataReduction },
        },
        simulation: { ...initState.simulation, data: obj.simulation },
      }
    } catch (error) {
      console.error('Error while parsing URL :', error.message)
    }
  }
  return initState
}

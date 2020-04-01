import type { AllParams } from '../../../algorithms/types/Param.types'
import { State } from './state'
import * as t from 'io-ts'
import { either, isLeft } from 'fp-ts/lib/Either'
import { PathReporter } from 'io-ts/lib/PathReporter'

const DateType = new t.Type<Date, string, unknown>(
  'DateType',
  (u): u is Date => u instanceof Date,
  (u, c) =>
    either.chain(t.string.validate(u, c), (s) => {
      const d = new Date(s)
      return isNaN(d.getTime()) ? t.failure(u, c) : t.success(d)
    }),
  (a) => a.toISOString(),
)

const DateRangeType = t.type({
  tMin: DateType,
  tMax: DateType,
})

const SimulationData = t.type({
  simulationTimeRange: DateRangeType,
  numberStochasticRuns: t.number,
})

const TimePointType = t.type({
  t: DateType,
  y: t.number,
})

const TimeSeriesType = t.array(TimePointType)

const URLSerializationType = t.type({
  current: t.string,
  containment: TimeSeriesType,
  simulation: SimulationData,
})

/*

Quick and dirty helper to serialize/deserialize parameters within the URL, 
so people can share/save it and keep their parameters

This could have been done inside a redux middleware, but with some refacto.

We use JSON.stringify to serialize things out. It's not the most optimized way at all,
but it works, and it's simple enough. Note that Date object is serialized as a string,
so some extra work is needed during deserialization.

*/

export async function serializeScenarioToURL(scenarioState: State, params: AllParams) {
  const toSave = URLSerializationType.encode({
    current: scenarioState.current,
    simulation: params.simulation,
    containment: scenarioState.data.containment.reduction,
  })

  window.history.pushState('', '', `?${encodeURIComponent(JSON.stringify(toSave))}`)
}

export function deserializeScenarioFromURL(initState: State): State {
  if (!window.location.search) {
    return initState
  }

  let obj: unknown
  try {
    /*
      We deserialise the URL by removing the first char ('?'), and applying JSON.parse 
    */
    obj = JSON.parse(decodeURIComponent(window.location.search.slice(1)))
  } catch (e) {
    console.error('Error while parsing URL: ', e.message)
    return initState
  }

  const result = URLSerializationType.decode(obj)

  if (isLeft(result)) {
    const errors = PathReporter.report(result)
    console.warn(`Found ${errors.length} error(s) while decoding URL: \n${errors.join('\n\n')}`)
    return initState
  }

  const urlParam = result.right

  return {
    scenarios: initState.scenarios,
    current: urlParam.current,
    data: {
      population: initState.data.population,
      containment: {
        reduction: urlParam.containment,
        numberPoints: urlParam.containment.length,
      },
      epidemiological: initState.data.epidemiological,
      simulation: urlParam.simulation,
    },
  }
}

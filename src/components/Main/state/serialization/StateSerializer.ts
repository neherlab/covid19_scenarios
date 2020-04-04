/**
 * Conversion layer responsible for serialization/deserialization
 */

import { defaultsDeep } from 'lodash'
import { State } from '../state'
import { fromDto, toDto } from './DtoConverter'

export const serialize = (scenarioState: State): string => {
  const dto = toDto(scenarioState)

  return encodeURIComponent(JSON.stringify(dto))
}

export const deserialize = (queryString: string, currentState: State) => {
  const dto = JSON.parse(decodeURIComponent(queryString))

  // dates object that have been serialized to string (safe to mutate here)
  dto.simulation.simulationTimeRange.tMin = new Date(dto.simulation.simulationTimeRange.tMin)
  dto.simulation.simulationTimeRange.tMax = new Date(dto.simulation.simulationTimeRange.tMax)

  dto.containment = dto.containment.map((c: { t: string; y: number }) => ({
    y: c.y,
    t: new Date(c.t),
  }))

  const persistedScenario = fromDto(dto)

  // "merging" persisted scenario with current state
  // Note: persisted scenario bits take precedence
  return defaultsDeep(persistedScenario, currentState)
}

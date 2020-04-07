/**
 * Conversion layer responsible for serialization/deserialization
 */

import JSURL from 'jsurl'
import { defaultsDeep } from 'lodash'
import { State } from '../state'
import { fromDto, toDto } from './DtoConverter'

export const serialize = (scenarioState: State): string => {
  const dto = toDto(scenarioState)

  return JSURL.stringify(dto)
}

export const deserialize = (queryString: string, currentState: State) => {
  const dto = JSURL.parse(queryString)
  const persistedScenario = fromDto(dto)

  // "merging" persisted scenario with current state
  // Note: persisted scenario bits take precedence
  return defaultsDeep(persistedScenario, currentState)
}

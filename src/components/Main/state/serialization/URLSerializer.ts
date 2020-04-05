import { State } from '../state'
import { serialize, deserialize } from './StateSerializer'

/**
 * Layer responsible for pushing the serialized state to browser history and reading it from the URL
 */

export const serializeScenarioToURL = (scenarioState: State) => {
  const queryString = serialize(scenarioState)

  window.history.pushState('', '', `?${queryString}`)
}

export const deserializeScenarioFromURL = (currentAppState: State): State => {
  const { search } = window.location

  if (search) {
    const queryString = search.slice(1) // removing the first char ('?')

    try {
      return deserialize(queryString, currentAppState)
    } catch (error) {
      console.error('Error while parsing URL :', error.message)
    }
  }

  return currentAppState
}

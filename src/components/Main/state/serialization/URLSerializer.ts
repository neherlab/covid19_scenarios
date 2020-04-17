import { Location } from 'history'
import { State } from '../state'
import { serialize, deserialize } from './StateSerializer'

/**
 * The reason for URL format versioning is because in the future we might completely change the way we serialize state to the URL
 * For instance, maybe the amount of data needed to be persisted grows behind any advisable size, so we'll have to provide a stronger compression
 * At that point, we might choose to replace JSURL with something else
 * However, our users could still have the old link bookmarked accessible from some old email
 * That's why we need version, as a separate link variable
 * By reading the version first, and then applying a query deserialization for that version, we're ensuring backward compatibility
 * Once we eventually start using de/serializer version 2, the old deserializer (but not the serializer) should still be in our codebase,
 * and there should be a switch..case on the version, for using the right deserializer
 */
const VERSION_PARAM_NAME = 'v'
const QUERY_PARAM_NAME = 'q'
const CURRENT_VERSION = '1'
const VALID_VERSIONS = new Set([CURRENT_VERSION])

/**
 * Layer responsible for pushing the serialized state to browser history and reading it from the URL
 */

/**
 * Builds a string in a form of "?v=1&q=datablob"
 */
export const buildLocationSearch = (scenarioState: State): string => {
  const queryString = serialize(scenarioState)

  return `?${VERSION_PARAM_NAME}=${CURRENT_VERSION}&${QUERY_PARAM_NAME}=${queryString}`
}

/**
 * Reads the browser URL and returna the updated application state
 */
export const deserializeScenarioFromURL = (location: Location, currentAppState: State): State => {
  const { search } = location

  if (search) {
    const searchParams = new URLSearchParams(search.slice(1)) // removing the first char ('?')
    const version = searchParams.get(VERSION_PARAM_NAME)
    const queryString = searchParams.get(QUERY_PARAM_NAME)

    if (!version || !VALID_VERSIONS.has(version)) {
      console.error('Invalid URL version:', version)
    } else if (queryString) {
      try {
        return deserialize(queryString, currentAppState)
      } catch (error) {
        console.error('Error while parsing URL:', error.message)
      }
    }
  }

  return currentAppState
}

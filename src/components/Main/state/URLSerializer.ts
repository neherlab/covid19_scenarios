import _ from 'lodash'
import { isLeft } from 'fp-ts/lib/Either'
import { PathReporter } from 'io-ts/lib/PathReporter'
import { ScenarioDataType, ScenarioData } from '../../../algorithms/types/Param.types'
import { State, CUSTOM_SCENARIO_NAME } from './state'

export async function serializeScenarioToURL(data: ScenarioData) {
  const toSave = ScenarioDataType.encode(data)
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

  console.log('HELLO', initState, obj)
  const result = ScenarioDataType.decode(obj)

  if (isLeft(result)) {
    const errors = PathReporter.report(result)
    console.warn(`Found ${errors.length} error(s) while decoding URL: \n${errors.join('\n\n')}`)
    return initState
  }

  return {
    // Automatically add CUSTOM_SCENARIO_NAME in the scenarios.
    // This replicates the logic found in reducer.ts. We probably don't need the unique check yet
    // however its there just as a precaution.
    scenarios: _.uniq([...initState.scenarios, CUSTOM_SCENARIO_NAME]),
    current: CUSTOM_SCENARIO_NAME,
    data: result.right,
  }
}

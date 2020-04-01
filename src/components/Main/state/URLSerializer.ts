import { ScenarioDataType } from '../../../algorithms/types/Param.types'
import { State } from './state'
import * as t from 'io-ts'
import { isLeft } from 'fp-ts/lib/Either'
import { PathReporter } from 'io-ts/lib/PathReporter'

const URLSerializationType = t.type({
  current: t.string,
  data: ScenarioDataType,
})

export async function serializeScenarioToURL(scenarioState: State) {
  const toSave = URLSerializationType.encode({
    current: scenarioState.current,
    data: scenarioState.data,
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

  return {
    scenarios: initState.scenarios,
    current: result.right.current,
    data: result.right.data,
  }
}

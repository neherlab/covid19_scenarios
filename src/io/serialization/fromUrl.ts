import { ScenarioParameters } from '../../algorithms/types/Param.types'

import { decode } from '../encoding/decode'

import { deserialize } from './deserialize'

export function fromUrl(url: string): ScenarioParameters {
  const obj = decode(url)
  const str = JSON.stringify(obj)
  return deserialize(str)
}

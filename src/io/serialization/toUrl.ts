import { ScenarioParameters } from '../../algorithms/types/Param.types'

import { encode } from '../encoding/encode'

import { serialize } from './serialize'

export function toUrl(data: ScenarioParameters): string {
  const serialized = serialize(data)
  const obj = JSON.parse(serialized)
  return encode(obj)
}

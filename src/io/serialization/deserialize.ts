import semver from 'semver'

import type { ScenarioParameters } from '../../algorithms/types/Param.types'

import {
  DeserializationErrorJsonSyntaxInvalid,
  DeserializationErrorSchemaVersionInvalid,
  DeserializationErrorSchemaVersionMissing,
} from './errors'

import { SERIALIZERS } from './versioning'

export function deserialize(dataString: string): ScenarioParameters {
  try {
    const shareableDangerous = JSON.parse(dataString) as { schemaVer?: string }

    const schemaVer = semver.valid(shareableDangerous?.schemaVer)

    if (!schemaVer) {
      throw new DeserializationErrorSchemaVersionMissing()
    }

    const deserialize = SERIALIZERS.get(schemaVer)?.deserialize
    if (!deserialize) {
      throw new DeserializationErrorSchemaVersionInvalid(schemaVer)
    }

    return deserialize(dataString)
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new DeserializationErrorJsonSyntaxInvalid(error.message)
    } else {
      throw error
    }
  }
}

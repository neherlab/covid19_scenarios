import semver from 'semver'

import type { ScenarioParameters } from '../../algorithms/types/Param.types'

import {
  DeserializationErrorJsonSyntaxInvalid,
  DeserializationErrorSchemaVersionInvalid,
  DeserializationErrorSchemaVersionMissing,
} from './errors'

import { SERIALIZER_VERSIONS, SERIALIZERS } from './versioning'

export function deserialize(dataString: string): ScenarioParameters {
  try {
    const shareableDangerous = JSON.parse(dataString) as { schemaVer?: string }

    const schemaVer = semver.valid(shareableDangerous?.schemaVer)

    if (schemaVer) {
      const deserialize = SERIALIZERS.get(schemaVer)?.deserialize
      if (deserialize) {
        return deserialize(dataString)
      }

      throw new DeserializationErrorSchemaVersionInvalid(schemaVer, SERIALIZER_VERSIONS)
    }

    throw new DeserializationErrorSchemaVersionMissing()
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new DeserializationErrorJsonSyntaxInvalid(error.message)
    } else {
      throw error
    }
  }
}

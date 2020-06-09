import semver from 'semver'

import type { ScenarioParameters } from '../../algorithms/types/Param.types'

import { DeserializationErrorSchemaVersionInvalid, SerializationErrorSchemaVersionNotLatest } from './errors'

import { deserialize } from './deserialize'

import { SERIALIZER_LATEST, SERIALIZER_VERSION_LATEST, SERIALIZER_VERSIONS } from './versioning'

export function serialize(data: ScenarioParameters): string {
  const serializerLatest = SERIALIZER_LATEST.serialize
  const serialized = serializerLatest(data)

  if (process.env.NODE_ENV !== 'production') {
    const shareableDangerous = JSON.parse(serialized) as { schemaVer?: string }
    const schemaVer = semver.valid(shareableDangerous?.schemaVer)
    if (!schemaVer) {
      throw new DeserializationErrorSchemaVersionInvalid(shareableDangerous?.schemaVer)
    }

    if (schemaVer !== SERIALIZER_VERSION_LATEST) {
      throw new SerializationErrorSchemaVersionNotLatest(schemaVer, SERIALIZER_VERSIONS)
    }

    deserialize(serialized)
  }

  return serialized
}

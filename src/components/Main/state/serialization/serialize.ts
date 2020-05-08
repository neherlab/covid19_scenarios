import { head } from 'lodash'

import queryString from 'query-string'
import semver from 'semver'

import type { SerializableData } from './SerializableData'

import {
  DeserializationErrorJsonSyntaxInvalid,
  DeserializationErrorSchemaVersionInvalid,
  DeserializationErrorSchemaVersionMissing,
  ErrorSchemaSerializerVersionNotLatest,
  ErrorURLSerializerVersionInvalid,
} from './errors'

import {
  SERIALIZERS,
  SERIALIZER_LATEST,
  SERIALIZER_VERSIONS,
  SERIALIZER_VERSION_LATEST,
  URL_ENCODERS,
  URL_ENCODER_LATEST,
  URL_ENCODER_VERSION_LATEST,
} from './versioning'

// import v1_0_0 from './serialization/v1.0.0/serialize'

export function serialize(data: SerializableData): string {
  const serializerLatest = SERIALIZER_LATEST.serialize
  const serialized = serializerLatest(data)

  if (process.env.NODE_ENV !== 'production') {
    const shareableDangerous = JSON.parse(serialized) as { schemaVer?: string }
    const schemaVer = semver.valid(shareableDangerous?.schemaVer)
    if (!schemaVer) {
      throw new DeserializationErrorSchemaVersionInvalid(shareableDangerous?.schemaVer)
    }

    if (schemaVer !== SERIALIZER_VERSION_LATEST) {
      throw new ErrorSchemaSerializerVersionNotLatest(schemaVer, SERIALIZER_VERSIONS)
    }

    deserialize(serialized)
  }

  return serialized
}

export function deserialize(dataString: string): SerializableData {
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

export function dataToURL(data: SerializableData): string {
  const serialized = serialize(data)
  const obj = JSON.parse(serialized)
  const q = URL_ENCODER_LATEST.encode(obj)
  const v = URL_ENCODER_VERSION_LATEST
  const query = queryString.stringify({ v, q })
  return `/?${query}`
}

export function first<T>(a: T | T[]) {
  return Array.isArray(a) ? head(a) : a
}

export function dataFromUrl(url: string): SerializableData | null {
  const params = queryString.parse(url)
  const v = first(params?.v)
  const q = first(params?.q)

  if (!q) {
    return null
  }

  if (!v) {
    throw new ErrorURLSerializerVersionInvalid(v)
  }

  const decode = URL_ENCODERS.get(v)?.decode
  if (!decode) {
    throw new ErrorURLSerializerVersionInvalid(v)
  }

  const obj = decode(q)
  const str = JSON.stringify(obj)
  return deserialize(str)
}

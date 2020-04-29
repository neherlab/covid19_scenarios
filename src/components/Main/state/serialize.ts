/* eslint-disable @typescript-eslint/camelcase */

import { head, last } from 'lodash'

import queryString from 'query-string'
import semver from 'semver'

import type {
  AgeDistributionDatum,
  ScenarioDatum,
  SeverityDistributionDatum,
} from '../../../algorithms/types/Param.types'

import urlv1 from './encoding/v1/encode'

// import v1_0_0 from './serialization/v1.0.0/serialize'
import v2_0_0 from './serialization/v2.0.0/serialize'

export interface SerializableData {
  scenario: ScenarioDatum
  scenarioName: string
  ageDistribution: AgeDistributionDatum[]
  ageDistributionName: string
  severity: SeverityDistributionDatum[]
  severityName: string
}

export type Serializer = (input: SerializableData) => string
export type Deserializer = (input: string) => SerializableData

export interface Serializers {
  serialize: Serializer
  deserialize: Deserializer
}

export const SERIALIZERS = new Map<string, Serializers>(
  Object.entries({
    // '1.0.0': v1_0_0,
    '2.0.0': v2_0_0,
  }),
)

export const SERIALIZER_VERSIONS = semver.sort([...SERIALIZERS.keys()])
export const SERIALIZER_VERSION_LATEST = last(SERIALIZER_VERSIONS) ?? '2.0.0'
export const SERIALIZER_LATEST = SERIALIZERS.get(SERIALIZER_VERSION_LATEST) ?? v2_0_0

export type UrlEncoder = (obj: object) => string
export type UrlDecoder = (str: string) => object

export interface UrlEncoders {
  encode: UrlEncoder
  decode: UrlDecoder
}

export const URL_ENCODERS = new Map<string, UrlEncoders>(
  Object.entries({
    '1': urlv1,
  }),
)

export const URL_ENCODER_VERSIONS = [...URL_ENCODERS.keys()].sort()
export const URL_ENCODER_VERSION_LATEST = last(URL_ENCODER_VERSIONS) ?? '1'
export const URL_ENCODER_LATEST = URL_ENCODERS.get(URL_ENCODER_VERSION_LATEST) ?? urlv1

export class ErrorSchemaVersionMissing extends Error {
  public constructor() {
    super(`Error: when deserializing, \`schemaVer\` is missing`)
  }
}

export class ErrorSchemaVersionInvalid extends Error {
  public schemaVer?: string
  public constructor(schemaVer?: string) {
    super(`Schema error: when deserializing expected \`schemaVer\` to be one of \`[${SERIALIZER_VERSIONS}]\`, but received: ${schemaVer}`) // prettier-ignore
    this.schemaVer = schemaVer
  }
}

export class ErrorSchemaSerializerVersionNotLatest extends Error {
  public schemaVer: string
  public constructor(schemaVer: string) {
    super(`Schema error: when serializing expected \`schemaVer\` to be the latest among \`[${SERIALIZER_VERSIONS}]\`, but received: ${schemaVer}`) // prettier-ignore
    this.schemaVer = schemaVer
  }
}

export class ErrorURLSerializerVersionInvalid extends Error {
  public urlVer?: string | null
  public constructor(urlVer?: string | null) {
    super(`URL error: when serializing expected \`v\` to be one of \`[${URL_ENCODER_VERSIONS}]\`, but received: ${urlVer}`) // prettier-ignore
    this.urlVer = urlVer
  }
}

export function serialize(data: SerializableData): string {
  const serializerLatest = SERIALIZER_LATEST.serialize
  const serialized = serializerLatest(data)

  if (process.env.NODE_ENV !== 'production') {
    const shareableDangerous = JSON.parse(serialized) as { schemaVer?: string }
    const schemaVer = semver.valid(shareableDangerous?.schemaVer)
    if (!schemaVer) {
      throw new ErrorSchemaVersionInvalid(shareableDangerous?.schemaVer)
    }

    if (schemaVer !== SERIALIZER_VERSION_LATEST) {
      throw new ErrorSchemaSerializerVersionNotLatest(schemaVer)
    }

    deserialize(serialized)
  }

  return serialized
}

export function deserialize(dataString: string): SerializableData {
  const shareableDangerous = JSON.parse(dataString) as { schemaVer?: string }

  const schemaVer = semver.valid(shareableDangerous?.schemaVer)

  if (!schemaVer) {
    throw new ErrorSchemaVersionMissing()
  }

  const deserialize = SERIALIZERS.get(schemaVer)?.deserialize
  if (!deserialize) {
    throw new ErrorSchemaVersionInvalid(schemaVer)
  }

  return deserialize(dataString)
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

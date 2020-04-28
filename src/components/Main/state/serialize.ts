/* eslint-disable @typescript-eslint/camelcase */

import { last } from 'lodash'

import jsurl from 'jsurl'

import semver from 'semver'

import type {
  AgeDistributionDatum,
  ScenarioDatum,
  SeverityDistributionDatum,
} from '../../../algorithms/types/Param.types'

import v1_0_0 from './serialization/v1.0.0/serialize'
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
    '1.0.0': v1_0_0,
    '2.0.0': v2_0_0,
  }),
)

export const VERSIONS = semver.sort([...SERIALIZERS.keys()])
export const LATEST_VERSION = last(VERSIONS) ?? '1.0.0'
export const LATEST_SERIALIZERS = SERIALIZERS.get(LATEST_VERSION) ?? v1_0_0

export class ErrorSchemaVersionMissing extends Error {
  public constructor() {
    super(`Error: when deserializing, \`schemaVer\` is missing`)
  }
}

export class ErrorSchemaVersionInvalid extends Error {
  public schemaVer?: string

  public constructor(schemaVer?: string) {
    const schemaVerExpected = SERIALIZERS.keys().toString()
    super(
      `Schema error: when deserializing expected \`schemaVer\` to be one of \`${schemaVerExpected}\`, but received: ${schemaVer}`,
    )

    this.schemaVer = schemaVer
  }
}

export class ErrorSchemaSerializerVersionNotLatest extends Error {
  public schemaVer: string

  public constructor(schemaVer: string) {
    const schemaVerExpected = SERIALIZERS.keys().toString()
    super(
      `Schema error: when serializing expected \`schemaVer\` to be the latest among \`${schemaVerExpected}\`, but received: ${schemaVer}`,
    )

    this.schemaVer = schemaVer
  }
}

export function serialize(data: SerializableData): string {
  const serializerLatest = LATEST_SERIALIZERS.serialize
  const serialized = serializerLatest(data)

  if (process.env.NODE_ENV !== 'production') {
    const shareableDangerous = JSON.parse(serialized) as { schemaVer?: string }
    const schemaVer = semver.valid(shareableDangerous?.schemaVer)
    if (!schemaVer) {
      throw new ErrorSchemaVersionInvalid(shareableDangerous?.schemaVer)
    }

    if (schemaVer !== LATEST_VERSION) {
      throw new ErrorSchemaSerializerVersionNotLatest(schemaVer)
    }
  }

  return serialized
}

export function deserialize(dataString: string): SerializableData {
  const shareableDangerous = JSON.parse(dataString) as { schemaVer?: string }
  const schemaVer = semver.valid(shareableDangerous?.schemaVer)

  if (!schemaVer) {
    throw new ErrorSchemaVersionMissing()
  }

  const deserializer = SERIALIZERS.get(schemaVer)?.deserialize
  if (!deserializer) {
    throw new ErrorSchemaVersionInvalid(schemaVer)
  }

  return deserializer(dataString)
}

export function stateToURL(data: SerializableData): string {
  const serialized = serialize(data)
  const obj = JSON.parse(serialized)
  const url = jsurl.stringify(obj)
  return `/${url}`
}

export function stateFromUrl(url: string): SerializableData {
  const obj = jsurl.parse(url)
  const str = JSON.stringify(obj)
  return deserialize(str)
}

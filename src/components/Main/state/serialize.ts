/* eslint-disable @typescript-eslint/camelcase */

import { head, last } from 'lodash'

import queryString from 'query-string'
import semver from 'semver'

import type {
  AgeDistributionDatum,
  ScenarioDatum,
  SeverityDistributionDatum,
} from '../../../algorithms/types/Param.types'

import { appendDash } from '../../../helpers/appendDash'

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

export const SERIALIZER_VERSIONS = semver.sort(Array.from(SERIALIZERS.keys()))
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

export const URL_ENCODER_VERSIONS = Array.from(URL_ENCODERS.keys()).sort()
export const URL_ENCODER_VERSION_LATEST = last(URL_ENCODER_VERSIONS) ?? '1'
export const URL_ENCODER_LATEST = URL_ENCODERS.get(URL_ENCODER_VERSION_LATEST) ?? urlv1

export class URLDecodingError extends Error {}

export class ErrorURLSerializerVersionInvalid extends URLDecodingError {
  public urlVer?: string | null
  public constructor(urlVer?: string | null) {
    super(`URL error: when serializing expected \`v\` to be one of \`[${URL_ENCODER_VERSIONS}]\`, but received: ${urlVer}`) // prettier-ignore
    this.urlVer = urlVer
  }
}

export class DeserializationError extends Error {
  public readonly errors?: string[]
}

export class DeserializationErrorJsonSyntaxInvalid extends DeserializationError {
  public readonly errors?: string[]

  public constructor(syntaxErrorMessage: string) {
    const error = `invalid JSON syntax: '${syntaxErrorMessage}'`
    super(`when deserializing: ${error}`)
    this.errors = [error]
  }
}

export class DeserializationErrorSchemaVersionMissing extends DeserializationError {
  public readonly errors?: string[]

  public constructor() {
    const error = `\`schemaVer\` is missing`
    super(`when deserializing: ${error}`)
    this.errors = [error]
  }
}

export class DeserializationErrorSchemaVersionInvalid extends DeserializationError {
  public readonly schemaVer?: string
  public readonly errors?: string[]

  public constructor(schemaVer?: string) {
    const error = `expected \`schemaVer\` to be one of \`[${SERIALIZER_VERSIONS}]\`, but received: ${schemaVer}`
    super(`when deserializing: ${error}`)
    this.schemaVer = schemaVer
    this.errors = [error]
  }
}

export class DeserializationErrorValidationFailed extends DeserializationError {
  public errors?: string[]
  public constructor(errors?: string[]) {
    super(`when deserializing: validation failed:\n${errors?.map(appendDash)?.join('\n')}`)
    this.errors = errors
  }
}

export class DeserializationErrorConversionFailed extends DeserializationError {
  public errors?: string[]
  public constructor(error?: string) {
    super(`when deserializing: conversion failed: ${error}`)
    this.errors = error ? [error] : ['unknown error']
  }
}

export class SerializationError extends Error {}

export class ErrorSchemaSerializerVersionNotLatest extends SerializationError {
  public schemaVer: string
  public errors?: string[]
  public constructor(schemaVer: string) {
    const error = `when serializing: expected \`schemaVer\` to be the latest among \`[${SERIALIZER_VERSIONS}]\`, but received: ${schemaVer}` // prettier-ignore
    super(`when serializing: ${error}`)
    this.schemaVer = schemaVer
    this.errors = [error]
  }
}

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
      throw new ErrorSchemaSerializerVersionNotLatest(schemaVer)
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

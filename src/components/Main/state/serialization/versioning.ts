/* eslint-disable @typescript-eslint/camelcase */

import { last } from 'lodash'

import semver from 'semver'

import type { SerializableData } from './SerializableData'

import { getOrThrow } from '../../../../helpers/getOrThrow'

import urlv1 from '../encoding/v1/encode'

import v2_0_0 from './v2.0.0/serialize'

export type Serializer = (input: SerializableData) => string
export type Deserializer = (input: string) => SerializableData

export interface Serializers {
  serialize: Serializer
  deserialize: Deserializer
}

export const SERIALIZERS = new Map<string, Serializers>(
  Object.entries({
    ...v2_0_0,
  }),
)

export const SERIALIZER_VERSIONS = semver.sort(Array.from(SERIALIZERS.keys()))
export const SERIALIZER_VERSION_LATEST = last(SERIALIZER_VERSIONS)
export const SERIALIZER_LATEST = getOrThrow(SERIALIZERS, SERIALIZER_VERSION_LATEST)

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
export const URL_ENCODER_LATEST = getOrThrow(URL_ENCODERS, URL_ENCODER_VERSION_LATEST)

import { last } from 'lodash'

import type { ScenarioParameters } from '../../algorithms/types/Param.types'

import { getOrThrow } from '../../helpers/getOrThrow'

import urlv1 from './v1/encode'

export type Serializer = (input: ScenarioParameters) => string
export type Deserializer = (input: string) => ScenarioParameters

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

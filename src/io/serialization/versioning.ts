/* eslint-disable camelcase */

import { last } from 'lodash'

import semver from 'semver'

import type { ScenarioParameters } from '../../algorithms/types/Param.types'

import { getOrThrow } from '../../helpers/getOrThrow'

import v2_0_0 from './v2.0.0/serialize'
import v2_1_0 from './v2.1.0/serialize'

export type Serializer = (input: ScenarioParameters) => string
export type Deserializer = (input: string) => ScenarioParameters

export interface Serializers {
  serialize: Serializer
  deserialize: Deserializer
}

export const SERIALIZERS = new Map<string, Serializers>(
  Object.entries({
    ...v2_0_0,
    ...v2_1_0,
  }),
)

export const SERIALIZER_VERSIONS = semver.sort(Array.from(SERIALIZERS.keys()))
export const SERIALIZER_VERSION_LATEST = last(SERIALIZER_VERSIONS) ?? 'NO_SERIALIZERS'
export const SERIALIZER_LATEST = getOrThrow(SERIALIZERS, SERIALIZER_VERSION_LATEST)

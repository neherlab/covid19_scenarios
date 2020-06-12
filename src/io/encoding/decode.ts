import queryString from 'query-string'

import { head } from 'lodash'

import { ErrorURLDecoderVersionInvalid } from './errors'
import { URL_ENCODER_VERSIONS, URL_ENCODERS } from './versioning'

export function first<T>(a: T | T[]) {
  return Array.isArray(a) ? head(a) : a
}

export function decode(url: string) {
  const params = queryString.parse(url)
  const v = first(params?.v)
  const q = first(params?.q)

  if (!q) {
    return null
  }

  if (v) {
    const decodeVersioned = URL_ENCODERS.get(v)?.decode
    if (!decodeVersioned) {
      throw new ErrorURLDecoderVersionInvalid(v, URL_ENCODER_VERSIONS)
    }
    return decodeVersioned(q)
  }

  throw new ErrorURLDecoderVersionInvalid('Not provided', URL_ENCODER_VERSIONS)
}

import queryString from 'query-string'

import { URL_ENCODER_LATEST, URL_ENCODER_VERSION_LATEST } from './versioning'

export function encode(obj: object) {
  const q = URL_ENCODER_LATEST.encode(obj)
  const v = URL_ENCODER_VERSION_LATEST
  const query = queryString.stringify({ v, q })
  return `/?${query}`
}

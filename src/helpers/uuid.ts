import { v4 } from 'uuid'

import type { Id } from './types'

export type UUIDv4 = Id<'UUIDv4'>

export function uuidv4(): UUIDv4 {
  return v4() as UUIDv4
}

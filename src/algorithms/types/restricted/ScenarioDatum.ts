// IMPORTANT: do not import from this file directly

/*
 * This adds to scenario type some of the new properties that are internal to the application implementation.
 * Public inputs and outputs into the app should use the corresponding `*External` types.
 */

import type { Merge, StrictOmit } from 'ts-essentials'
import type { UUIDv4 } from '../../../helpers/uuid'
import type { MitigationIntervalExternal, ScenarioDatumExternal, ScenarioDatumMitigationExternal } from '../Param.types'

export interface MitigationInterval extends MitigationIntervalExternal {
  id: UUIDv4
}

export interface ScenarioDatumMitigationInternalMutable extends ScenarioDatumMitigationExternal {
  mitigationIntervals: MitigationInterval[]
}

export type ScenarioDatumMitigation = ScenarioDatumMitigationInternalMutable

export interface ScenarioDatumSubsetOfMitigationWithIds extends ScenarioDatumExternal {
  mitigation: ScenarioDatumMitigation
}

export type ScenarioDatumWithoutMitigation = StrictOmit<ScenarioDatumExternal, 'mitigation'>

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ScenarioDatum extends Merge<ScenarioDatumWithoutMitigation, ScenarioDatumSubsetOfMitigationWithIds> {}

export interface ScenarioData {
  name: string
  data: ScenarioDatum
}

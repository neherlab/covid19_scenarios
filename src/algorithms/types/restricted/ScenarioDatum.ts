// IMPORTANT: do not import from this file directly

/*
 * This adds to scenario type some of the new properties that are internal to the application implementation.
 * Public inputs and outputs into the app should use the corresponding `*External` types.
 */

import type { Merge, StrictOmit } from 'ts-essentials'

import type { MitigationIntervalExternal, ScenarioDatumExternal, ScenarioDatumMitigationExternal } from '../Param.types'

export interface MitigationInterval extends MitigationIntervalExternal {
  id: string
}

export interface ScenarioDatumMitigationInternalMutable extends ScenarioDatumMitigationExternal {
  mitigationIntervals: MitigationInterval[]
}

export type ScenarioDatumMitigation = ScenarioDatumMitigationInternalMutable

export interface ScenarioDatumSubsetOfMitigationWithIds extends ScenarioDatumExternal {
  mitigation: ScenarioDatumMitigation
}

export type ScenarioDatumWithoutMitigation = StrictOmit<ScenarioDatumExternal, 'mitigation'>

export type ScenarioDatum = Merge<ScenarioDatumWithoutMitigation, ScenarioDatumSubsetOfMitigationWithIds>

export interface ScenarioData {
  name: string
  data: ScenarioDatum
}

import { omit } from 'lodash'

import { uuidv4 } from '../../helpers/uuid'

import {
  MitigationAgeSpecificDatum,
  MitigationAgeSpecificDatumExternal,
  MitigationInterval,
  MitigationIntervalExternal,
  ScenarioDatum,
  ScenarioDatumExternal,
} from './Param.types'

export function mitigtaionIntervalAgeSpecificToInternal(
  mitigationAgeSpecificData: MitigationAgeSpecificDatumExternal[],
): MitigationAgeSpecificDatum[] {
  return mitigationAgeSpecificData.map((datum) => ({ ...datum, id: uuidv4() } as MitigationAgeSpecificDatum))
}

export function mitigtaionIntervalToInternal(interval: MitigationIntervalExternal): MitigationInterval {
  return {
    ...interval,
    id: uuidv4(),
    mitigationAgeSpecificData: mitigtaionIntervalAgeSpecificToInternal(interval.mitigationAgeSpecificData),
  }
}

export function toInternal(scenario: ScenarioDatumExternal): ScenarioDatum {
  const { mitigationIntervals } = scenario.mitigation
  return {
    ...scenario,
    mitigation: {
      ...scenario.mitigation,
      mitigationIntervals: mitigationIntervals.map(mitigtaionIntervalToInternal),
    },
  }
}

export function mitigtaionIntervalAgeSpecificToExternal(
  mitigationAgeSpecificData: MitigationAgeSpecificDatum[],
): MitigationAgeSpecificDatumExternal[] {
  return mitigationAgeSpecificData.map((datum) => omit(datum, 'id'))
}

export function mitigationIntervalToExternal(interval: MitigationInterval): MitigationIntervalExternal {
  const intervalWithoutId = omit(interval, 'id')
  return {
    ...intervalWithoutId,
    mitigationAgeSpecificData: mitigtaionIntervalAgeSpecificToExternal(intervalWithoutId.mitigationAgeSpecificData),
  }
}

export function toExternal(scenario: ScenarioDatum): ScenarioDatumExternal {
  const { mitigationIntervals } = scenario.mitigation
  return {
    ...scenario,
    mitigation: {
      ...scenario.mitigation,
      mitigationIntervals: mitigationIntervals.map(mitigationIntervalToExternal),
    },
  }
}

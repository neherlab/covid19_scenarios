import { omit } from 'lodash'

import { v4 as uuidv4 } from 'uuid'

import { MitigationInterval, MitigationIntervalExternal, ScenarioDatum, ScenarioDatumExternal } from './Param.types'

export function addId(interval: MitigationIntervalExternal): MitigationInterval {
  return { ...interval, id: uuidv4() }
}

export function removeId(interval: MitigationInterval): MitigationIntervalExternal {
  return omit(interval, 'id')
}

export function toInternal(scenario: ScenarioDatumExternal): ScenarioDatum {
  const { mitigationIntervals } = scenario.mitigation
  return {
    ...scenario,
    mitigation: {
      ...scenario.mitigation,
      mitigationIntervals: mitigationIntervals.map(addId),
    },
  }
}

export function toExternal(scenario: ScenarioDatum): ScenarioDatumExternal {
  const { mitigationIntervals } = scenario.mitigation
  return {
    ...scenario,
    mitigation: {
      ...scenario.mitigation,
      mitigationIntervals: mitigationIntervals.map(removeId),
    },
  }
}

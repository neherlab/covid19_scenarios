import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'
import createColor from 'create-color'

import { MitigationInterval, MitigationIntervals } from '../types/Param.types'

export function suggestNextMitigationInterval(intervals: MitigationIntervals): MitigationInterval {
  const tMinMoment = moment()
  const tMaxMoment = tMinMoment.clone().add(30, 'days')

  const timeRange = { tMin: moment().toDate(), tMax: tMaxMoment.toDate() }

  const interval: Omit<MitigationInterval, 'color'> = {
    id: uuidv4(),
    name: `Intervention from ${tMinMoment.format('D MMM YYYY')}`,
    timeRange,
    mitigationValue: 10,
  }

  const color = createColor(interval)

  return { ...interval, color }
}

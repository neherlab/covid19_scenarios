import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'
import createColor from 'create-color'
import type { StrictOmit } from 'ts-essentials'

import type { MitigationInterval } from '../types/Param.types'

export function suggestNextMitigationInterval(intervals: MitigationInterval[]): MitigationInterval {
  const tMinMoment = moment()
  const tMaxMoment = tMinMoment.clone().add(30, 'days')

  const timeRange = { begin: moment().toDate(), end: tMaxMoment.toDate() }

  const interval: StrictOmit<MitigationInterval, 'color'> = {
    id: uuidv4(),
    name: `Intervention from ${tMinMoment.format('D MMM YYYY')}`,
    timeRange,
    transmissionReduction: { begin: 10, end: 30 },
  }

  const color = createColor(interval)

  return { ...interval, color }
}

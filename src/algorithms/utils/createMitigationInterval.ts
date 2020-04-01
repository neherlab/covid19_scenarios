import _ from 'lodash'

import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'

import { MitigationInterval, MitigationIntervals } from '../types/Param.types'

export function suggestNextMitigationInterval(intervals: MitigationIntervals): MitigationInterval {
  const tMaxMoments = intervals.map((interval) => moment(interval.timeRange.tMax))
  const tMinMoment = _.isEmpty(tMaxMoments) ? moment().startOf('day') : moment.max(tMaxMoments)
  const tMaxMoment = tMinMoment.clone().add(3, 'month')

  const timeRange = { tMin: tMinMoment.toDate(), tMax: tMaxMoment.toDate() }

  return {
    id: uuidv4(),
    name: `Act from ${tMinMoment.format('D MMM YYYY')}`,
    timeRange,
    mitigationValue: 1,
  }
}

import _ from 'lodash'

import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'

import { MitigationInterval, MitigationIntervals } from '../types/Param.types'

export function suggestNextMitigationInterval(intervals: MitigationIntervals): MitigationInterval {
  const tMaxMoments = intervals.map((interval) => moment(interval.timeRange.tMax))
  const tMin = _.isEmpty(tMaxMoments) ? moment().startOf('day').toDate() : moment.max(tMaxMoments).toDate()
  const tMax = moment(tMin).add('3 months').toDate()
  return {
    id: uuidv4(),
    name: `Act from ${moment(tMin).format('D MMM YYYY')}`,
    timeRange: { tMin, tMax },
    mitigationValue: 1,
  }
}

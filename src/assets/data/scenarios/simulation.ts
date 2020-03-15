import moment from 'moment'

import { SimulationData } from '../../../algorithms/Param.types'

const simulationData: SimulationData = {
  simulationTimeRange: {
    tMin: moment('2020-03-01').toDate(),
    tMax: moment('2020-03-01')
      .add(0.5, 'year')
      .toDate(),
  },
  numberStochasticRuns: 0,
}

export default simulationData

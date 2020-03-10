import moment from 'moment'

import { SimulationData } from '../../../algorithms/Param.types'

const simulationData: SimulationData = {
  tMin: moment().toDate(),
  tMax: moment()
    .add(0.5, 'year')
    .toDate(),
  numberStochasticRuns: 0,
}

export default simulationData

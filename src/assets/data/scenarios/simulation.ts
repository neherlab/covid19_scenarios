import moment from 'moment'
import simulationPreset from '../simulation.json'

import { SimulationData } from '../../../algorithms/types/Param.types'

const simulationData = {'default':
  {
    simulationTimeRange: {
      tMin: moment('2020-03-01').toDate(),
      tMax: moment('2020-03-01')
        .add(0.5, 'year')
        .toDate(),
    },
    numberStochasticRuns: 0
  }
}

simulationPreset.forEach(function(d){
  simulationData[d.name] = {
    simulationTimeRange: {
      tMin: moment(d.data.tMin).toDate(),
      tMax: moment(d.data.tMax).toDate()
    },
    numberStochasticRuns: 0,
   }
 }
)

export default simulationData

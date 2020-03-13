import { ContainmentData, DateRange } from '../../../algorithms/Param.types'
import { makeTimeSeries } from '../../../algorithms/TimeSeries'
import simulationData from './simulation'

export interface ContainmentScenario {
  name: string
  data: ContainmentData
}

const reductions = [
  {
    name: 'No mitigation',
    reduction: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
  },
  {
    name: 'Weak mitigation',
    reduction: [1.0, 0.9, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8],
  },
  {
    name: 'Moderate mitigation',
    reduction: [1.0, 0.8, 0.7, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6],
  },
  {
    name: 'Strong mitigation',
    reduction: [1.0, 0.7, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.45, 0.45],
  },
]

const containmentScenarios: ContainmentScenario[] = reductions.map(d => {
  return {name: d.name, data: {reduction: makeTimeSeries(simulationData.simulationTimeRange, d.reduction)}}
})

export default containmentScenarios

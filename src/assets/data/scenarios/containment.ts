import { ContainmentData } from '../../../algorithms/types/Param.types'
import { makeTimeSeries } from '../../../algorithms/utils/TimeSeries'
import simulationData from './simulation'
import i18next from 'i18next'

export interface ContainmentScenario {
  name: string
  data: ContainmentData
}

const reductions = [
  {
    name: i18next.t('No mitigation'),
    reduction: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
  },
  {
    name: i18next.t('Weak mitigation'),
    reduction: [1.0, 0.9, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8],
  },
  {
    name: i18next.t('Moderate mitigation'),
    reduction: [1.0, 0.8, 0.7, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6],
  },
  {
    name: i18next.t('Strong mitigation'),
    reduction: [1.0, 0.7, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.45, 0.45],
  },
]

const containmentScenarios: ContainmentScenario[] = reductions.map(d => {
  return {name: d.name, data: {reduction: makeTimeSeries(simulationData.default.simulationTimeRange, d.reduction), numberPoints: d.reduction.length}}
})

export default containmentScenarios

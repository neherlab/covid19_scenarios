import { ContainmentData } from '../../../algorithms/Param.types'

export interface ContainmentScenario {
  name: string
  data: ContainmentData
}

const containmentScenarios: ContainmentScenario[] = [
  {
    name: 'No Reduction',
    data: { reduction: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0] },
  },
  {
    name: 'Weak Reduction',
    data: { reduction: [1.0, 0.9, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8] },
  },
  {
    name: 'Moderate Reduction',
    data: { reduction: [1.0, 0.8, 0.7, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6] },
  },
  {
    name: 'Strong Reduction',
    data: { reduction: [1.0, 0.7, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.45, 0.45] },
  },
]

export default containmentScenarios

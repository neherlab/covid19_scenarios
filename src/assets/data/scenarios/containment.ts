import { Tagged } from '../../../helpers/types'

export type Reduction = Tagged<number[], 'Reduction'>

export interface ContainmentScenario {
  name: string
  reduction: Reduction
}

const containmentScenarios: ContainmentScenario[] = [
  {
    reduction: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0] as Reduction,
    name: 'No Reduction',
  },
  {
    reduction: [1.0, 0.9, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8] as Reduction,
    name: 'Weak Reduction',
  },
  {
    reduction: [1.0, 0.8, 0.7, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6] as Reduction,
    name: 'Moderate Reduction',
  },
  {
    reduction: [1.0, 0.7, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.45, 0.45] as Reduction, // prettier-ignore
    name: 'Strong Reduction',
  },
]

export default containmentScenarios

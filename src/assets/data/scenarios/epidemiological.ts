import { EpidemiologicalParams } from '../../../algorithms/Param.types'

export interface EpidemiologicalScenario {
  name: string
  epidemiologicalParams: EpidemiologicalParams
}

const epidemiologicalScenarios: EpidemiologicalScenario[] = [
  {
    name: 'Slow Northern',
    epidemiologicalParams: {
      r0: 1.7,
      incubationTime: 5,
      infectiousPeriod: 3,
      lengthHospitalStay: 10,
      seasonalForcing: 0.2,
      peakMonth: 0,
    },
  },
  {
    name: 'Moderate Northern',
    epidemiologicalParams: {
      r0: 2.1,
      incubationTime: 5,
      infectiousPeriod: 3,
      lengthHospitalStay: 10,
      seasonalForcing: 0.2,
      peakMonth: 0,
    },
  },
  {
    name: 'Fast Northern',
    epidemiologicalParams: {
      r0: 2.5,
      incubationTime: 4,
      infectiousPeriod: 3,
      lengthHospitalStay: 10,
      seasonalForcing: 0.2,
      peakMonth: 0,
    },
  },
  {
    name: 'Slow Southern',
    epidemiologicalParams: {
      r0: 1.7,
      incubationTime: 5,
      infectiousPeriod: 3,
      lengthHospitalStay: 10,
      seasonalForcing: 0.2,
      peakMonth: 6,
    },
  },
  {
    name: 'Moderate Southern',
    epidemiologicalParams: {
      r0: 2.1,
      incubationTime: 5,
      infectiousPeriod: 3,
      lengthHospitalStay: 10,
      seasonalForcing: 0.2,
      peakMonth: 6,
    },
  },
  {
    name: 'Fast Southern',
    epidemiologicalParams: {
      r0: 2.5,
      incubationTime: 4,
      infectiousPeriod: 3,
      lengthHospitalStay: 10,
      seasonalForcing: 0.2,
      peakMonth: 6,
    },
  },
  {
    name: 'Slow Tropical',
    epidemiologicalParams: {
      r0: 1.7,
      incubationTime: 5,
      infectiousPeriod: 3,
      lengthHospitalStay: 10,
      seasonalForcing: 0.0,
      peakMonth: 6,
    },
  },
  {
    name: 'Moderate Tropical',
    epidemiologicalParams: {
      r0: 2.1,
      incubationTime: 5,
      infectiousPeriod: 3,
      lengthHospitalStay: 10,
      seasonalForcing: 0.0,
      peakMonth: 6,
    },
  },
  {
    name: 'Fast Tropical',
    epidemiologicalParams: {
      r0: 2.5,
      incubationTime: 4,
      infectiousPeriod: 3,
      lengthHospitalStay: 10,
      seasonalForcing: 0.0,
      peakMonth: 6,
    },
  },
]

export default epidemiologicalScenarios

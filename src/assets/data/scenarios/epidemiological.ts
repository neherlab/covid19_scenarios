import { EpidemiologicalData } from '../../../algorithms/Param.types'

export interface EpidemiologicalScenario {
  name: string
  data: EpidemiologicalData
}

const epidemiologicalScenarios: EpidemiologicalScenario[] = [
  {
    name: 'Slow Northern',
    data: {
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
    data: {
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
    data: {
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
    data: {
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
    data: {
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
    data: {
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
    data: {
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
    data: {
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
    data: {
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

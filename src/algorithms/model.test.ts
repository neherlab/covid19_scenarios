import { infectionRate, getPopulationParams, initializePopulation, evolve } from './model'
import { interpolateTimeSeries } from './run'

// The input and output of getPopulationParams with the default settings
import getPopulationParamsInput from './__test_data__/getPopulationParams.input.default.json'

// The containment information with default settings
import { containment } from './__test_data__/containment.default.json'

// The input and output to initializePopulation with default settings
import initializePopulationInput from './__test_data__/initializePopulation.input.default.json'

// The output after the 5th generation using default settings
// This is a snapshot of the output that is being used as baseline
import { AllParamsFlat } from './types/Param.types'

const containmentWithDate = containment.map((value) => ({ y: value.y, t: new Date(value.t) }))
const containmentFunction = interpolateTimeSeries(containmentWithDate)

// The snapshot we load has the dates loaded as strings
// This just overwrites the simulationTimeRange field with the correct object types
const processParams = (params: typeof getPopulationParamsInput.params): AllParamsFlat => {
  return {
    ...params,
    simulationTimeRange: {
      tMin: new Date(params.simulationTimeRange.tMin),
      tMax: new Date(params.simulationTimeRange.tMax),
    },
  }
}

const identity = (x: number) => x

describe('model', () => {
  describe('infectionRate', () => {
    const dec2020 = new Date('2020-12-01').getTime()

    it('baseline', () => {
      expect(infectionRate(dec2020, 0.9, 3, 0.2)).toEqual(0.7768945041075702)
    })

    it('accounts for time correctly', () => {
      const jul2020 = new Date('2020-07-01').getTime()
      const feb2021 = new Date('2021-02-01').getTime()

      expect(infectionRate(jul2020, 0.4, 3, 0.2)).toEqual(0.4194279777676749)
      expect(infectionRate(feb2021, 1.5, 3, 0.2)).toEqual(1.5927050983124844)
    })

    it('accounts for avgInfectionRate correctly', () => {
      expect(infectionRate(dec2020, 0.4, 3, 0.2)).toEqual(0.3452864462700312)
      expect(infectionRate(dec2020, 1.5, 3, 0.2)).toEqual(1.294824173512617)
    })

    it('accounts for peakMonth correctly', () => {
      expect(infectionRate(dec2020, 0.9, 2, 0.2)).toEqual(0.8577915498773262)
      expect(infectionRate(dec2020, 0.9, 7, 0.2)).toEqual(0.842905568053961)
    })

    it('accounts for seasonalForcing correctly', () => {
      expect(infectionRate(dec2020, 0.9, 3, 0.1)).toEqual(0.8384472520537851)
      expect(infectionRate(dec2020, 0.9, 3, 0.4)).toEqual(0.6537890082151402)
    })
  })

  describe('getPopulationParams', () => {
    it('produces the expected output in the default scenario', () => {
      const inputParams = processParams(getPopulationParamsInput.params)
      const params = getPopulationParams(
        inputParams,
        getPopulationParamsInput.severity,
        getPopulationParamsInput.ageCounts,
        containmentFunction,
      )

      expect(params).toMatchSnapshot()
      containmentWithDate.forEach((o) => {
        expect(params.rate.infection(o.t)).toMatchSnapshot()
      })
    })
  })

  describe('initializePopulation', () => {
    it('produces the expected output in the default scenario', () => {
      const result = initializePopulation(
        initializePopulationInput.N,
        initializePopulationInput.numCases,
        initializePopulationInput.t0,
        initializePopulationInput.ages,
      )
      expect(result.current.susceptible).toMatchSnapshot()
    })
  })

  describe('evolve', () => {
    it('model evolution produces the expected output in the default scenario after running for 10 days', () => {
      const params = getPopulationParams(
        processParams(getPopulationParamsInput.params),
        getPopulationParamsInput.severity,
        getPopulationParamsInput.ageCounts,
        containmentFunction,
      )

      const input = initializePopulation(
        initializePopulationInput.N,
        initializePopulationInput.numCases,
        initializePopulationInput.t0,
        initializePopulationInput.ages,
      )

      // run model for 0.25 days
      const result = evolve(input, params, input.time + 10, identity)
      // compare result with snapshot
      expect(result).toMatchSnapshot()
    })
  })
})

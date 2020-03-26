import { infectionRate, getPopulationParams, initializePopulation, evolve } from '../model'
import { interpolateTimeSeries } from '../run'

// The input and output of getPopulationParams with the default settings
import getPopulationParamsInput from '../../assets/data/test/getPopulationParams.input.default.json'
import getPopulationParamsOutput from '../../assets/data/test/getPopulationParams.output.default.json'

// The containment information with default settings
import { containment } from '../../assets/data/test/containment.default.json'

// The input and output to initializePopulation with default settings
import initializePopulationInput from '../../assets/data/test/initializePopulation.input.default.json'
import initializePopulationOutput from '../../assets/data/test/initializePopulation.output.default.json'

// The output after the 5th generation using default settings
// This is a snapshot of the output that is being used as baseline
import evolveOutput5 from '../../assets/data/test/evolve.output.5th.default.json'
import { AllParamsFlat } from '../types/Param.types'

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

      const paramsInfectionRate = params.infectionRate
      delete params.infectionRate
      expect(params).toEqual(getPopulationParamsOutput)

      const infectionRateSnapshot = [
        1.0282794619390596,
        0.7815218936243379,
        0.6412716928585847,
        0.5119976633870834,
        0.4777650045046975,
        0.45115800505877796,
        0.43543682301649544,
        0.43252777618729166,
        0.44278731033335716,
        0.4649583238392415,
      ]

      containmentWithDate.forEach((o, i) => {
        expect(paramsInfectionRate(o.t)).toEqual(infectionRateSnapshot[i])
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
      expect(result.susceptible).toEqual(initializePopulationOutput.susceptible)
    })
  })

  describe('evolve', () => {
    it('produces the expected output in the default scenario after 5 evolutions', () => {
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

      const result = [...new Array(5)].reduce((acc) => {
        return evolve(acc, params, identity)
      }, input)

      // evolveOutput5 is the output after the 5th iteration with default parameters
      expect(result).toMatchSnapshot()
    })
  })
})

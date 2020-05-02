import { toBeCloseToNumber } from '@eirba/jest-ieee754'
import { AgeDistribution } from '../.generated/types'

import { getPopulationParams, infectionRate, initializePopulation } from './initialize'

import { evolve } from './model'

import { ageDisstribution, allParamsFlat, severity } from './__test_data__/getPopulationParams.input.default'

const identity = (x: number) => x

const jul2020 = new Date('2020-07-01')
const dec2020 = new Date('2020-12-01')
const feb2021 = new Date('2021-02-01')

const jul2020num = jul2020.getTime()
const dec2020num = dec2020.getTime()
const feb2021num = feb2021.getTime()

interface InitializePopulationParams {
  N: number
  numCases: number
  t0: number
  ages: AgeDistribution
}

const initializePopulationParams: InitializePopulationParams = {
  N: 195000,
  numCases: 213,
  t0: 1583049600000,
  ages: ageDisstribution,
}

expect.extend({ toBeCloseToNumber })

describe('model', () => {
  describe('infectionRate', () => {
    it('baseline', () => {
      expect(infectionRate(dec2020num, 0.9, 3, 0.2)).toBeCloseToNumber(0.7768945041075702)
    })

    it('accounts for time correctly', () => {
      expect(infectionRate(jul2020num, 0.4, 3, 0.2)).toBeCloseToNumber(0.4194279777676749)
      expect(infectionRate(feb2021num, 1.5, 3, 0.2)).toBeCloseToNumber(1.5927050983124844)
    })

    it('accounts for avgInfectionRate correctly', () => {
      expect(infectionRate(dec2020num, 0.4, 3, 0.2)).toBeCloseToNumber(0.3452864462700312)
      expect(infectionRate(dec2020num, 1.5, 3, 0.2)).toBeCloseToNumber(1.294824173512617)
    })

    it('accounts for peakMonth correctly', () => {
      expect(infectionRate(dec2020num, 0.9, 2, 0.2)).toBeCloseToNumber(0.8577915498773262)
      expect(infectionRate(dec2020num, 0.9, 7, 0.2)).toBeCloseToNumber(0.842905568053961)
    })

    it('accounts for seasonalForcing correctly', () => {
      expect(infectionRate(dec2020num, 0.9, 3, 0.1)).toBeCloseToNumber(0.8384472520537851)
      expect(infectionRate(dec2020num, 0.9, 3, 0.4)).toBeCloseToNumber(0.6537890082151402)
    })
  })

  describe('getPopulationParams', () => {
    it('calculates correct params', () => {
      const params = getPopulationParams(allParamsFlat, severity, ageDisstribution)
      expect(params).toMatchSnapshot()
    })
  })

  describe('initializePopulation', () => {
    it('produces the expected output in the default scenario', () => {
      const result = initializePopulation(
        initializePopulationParams.N,
        initializePopulationParams.numCases,
        initializePopulationParams.t0,
        initializePopulationParams.ages,
      )
      expect(result.current).toMatchSnapshot()
    })
  })

  describe('evolve', () => {
    it('produces correct output for 10 days', () => {
      const params = getPopulationParams(allParamsFlat, severity, ageDisstribution)

      const input = initializePopulation(
        initializePopulationParams.N,
        initializePopulationParams.numCases,
        initializePopulationParams.t0,
        initializePopulationParams.ages,
      )

      const result = evolve(input, params[0], input.time + 10, identity)
      expect(result).toMatchSnapshot()
    })
  })
})

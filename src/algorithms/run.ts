import * as math from 'mathjs'

import { OneCountryAgeDistribution } from '../assets/data/CountryAgeDistribution.types'

import { SeverityTableRow } from '../components/Main/Scenario/SeverityTable'

import { collectTotals, evolve, eulerStepsPerDay, getPopulationParams, initializePopulation } from './model'
import { AllParamsFlat } from './types/Param.types'
import { AlgorithmResult, SimulationTimePoint } from './types/Result.types'
import { TimeSeries } from './types/TimeSeries.types'

const identity = (x: number) => x
const poisson = (x: number) => {
  throw new Error('We removed dependency on `random` package. Currently `poisson` is not implemented')
}

/**
 *
 * Entry point for the algorithm
 *
 */
export default async function run(
  params: AllParamsFlat,
  severity: SeverityTableRow[],
  ageDistribution: OneCountryAgeDistribution,
  containment: TimeSeries,
): Promise<AlgorithmResult> {
  // const modelParams = getPopulationParams(params, severity, ageDistribution, interpolateTimeSeries(containment))
  // const tMin: number = params.simulationTimeRange.tMin.getTime()
  // const tMax: number = params.simulationTimeRange.tMax.getTime()
  // const initialCases = params.suspectedCasesToday
  // let initialState = initializePopulation(modelParams.populationServed, initialCases, tMin, ageDistribution)
  //
  // function simulate(initialState: SimulationTimePoint, func: (x: number) => number) {
  //   const dynamics = [initialState]
  //   let currState = initialState
  //   let i = 0
  //   while (currState.time < tMax) {
  //     currState = evolve(currState, modelParams, func)
  //     i++
  //     if (i % eulerStepsPerDay == 0) {
  //       dynamics.push(currState)
  //     }
  //   }
  //
  //   return collectTotals(dynamics)
  // }
  //
  // const sim: AlgorithmResult = {
  //   deterministic: simulate(initialState, identity),
  //   stochastic: [],
  //   params: modelParams,
  // }
  //
  // for (let i = 0; i < modelParams.numberStochasticRuns; i++) {
  //   initialState = initializePopulation(modelParams.populationServed, initialCases, tMin, ageDistribution)
  //   sim.stochastic.push(simulate(initialState, poisson))
  // }
  //
  // return sim
}

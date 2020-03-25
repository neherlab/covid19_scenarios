import { OneCountryAgeDistribution } from '../assets/data/CountryAgeDistribution.types'

import { SeverityTableRow } from '../components/Main/Scenario/SeverityTable'

import { collectTotals, evolve, getPopulationParams, initializePopulation } from './model'
import { AllParamsFlat } from './types/Param.types'
import { AlgorithmResult, SimulationTimePoint } from './types/Result.types'
import { TimeSeries } from './types/TimeSeries.types'

const identity = (x: number) => x
const poisson = (x: number) => {
  throw new Error('We removed dependency on `random` package. Currently `poisson` is not implemented')
}

// NOTE: Assumes containment is sorted ascending in time.
export function interpolateTimeSeries(containment: TimeSeries): (t: Date) => number {
  const Ys = containment.map(d => d.y);
  const Ts = containment.map(d => Number(d.t));

  return (t: Date) => {
    if (t <= containment[0].t){
      return containment[0].y
    } else if (t >= containment[containment.length-1].t) {
      return containment[containment.length-1].y
    } else {
      const i = containment.findIndex(d => Number(t) < Number(d.t))
     
      // Eval spline will return the function value @ t, fit to a spline
      // Requires the containment strengths (ys) and derivatives (yps) and times (ts)
      const eval_spline = (t : number, Yps : number[]) => {
          const f = (t - Ts[i-1]) / (Ts[i] - Ts[i-1])
          const a = +Yps[i-1]*(Ts[i] - Ts[i-1]) - (Ys[i]-Ys[i-1])
          const b = -Yps[i]  *(Ts[i] - Ts[i-1]) + (Ys[i]-Ys[i-1])
          const q = (1-f)*Ys[i-1] + f*Ys[i] + f*(1-f)*(a*(1-f)+b*f)

          return q
      };

      const eval_linear = (t : number) => {
          const deltaY = Ys[i] - Ys[i-1]
          const deltaT = Ts[i] - Ts[i-1]

          const dS = deltaY / deltaT
          const dT = t - Ts[i-1]

          return Ys[i-1] + dS * dT
      }

      return eval_linear(Number(t));
    }
  }
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
  const modelParams = getPopulationParams(params, severity, ageDistribution, interpolateTimeSeries(containment))
  const tMin: number = params.simulationTimeRange.tMin.getTime()
  const tMax: number = params.simulationTimeRange.tMax.getTime()
  const initialCases = params.suspectedCasesToday
  let initialState = initializePopulation(modelParams.populationServed, initialCases, tMin, ageDistribution)

  function simulate(initialState: SimulationTimePoint, func: (x: number) => number) {
    const dynamics = [initialState]
    while (dynamics[dynamics.length - 1].time < tMax) {
      const pop = dynamics[dynamics.length - 1]
      dynamics.push(evolve(pop, modelParams, func))
    }

    return collectTotals(dynamics)
  }

  const sim: AlgorithmResult = {
    deterministicTrajectory: simulate(initialState, identity),
    stochasticTrajectories: [],
    params: modelParams,
  }

  for (let i = 0; i < modelParams.numberStochasticRuns; i++) {
    initialState = initializePopulation(modelParams.populationServed, initialCases, tMin, ageDistribution)
    sim.stochasticTrajectories.push(simulate(initialState, poisson))
  }

  return sim
}

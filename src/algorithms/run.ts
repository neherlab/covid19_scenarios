import random from 'random'
import { CountryAgeDistribution, OneCountryAgeDistribution } from '../assets/data/CountryAgeDistribution.types'
import { SeverityTableRow } from '../components/Main/SeverityTable'
import { AllParams } from './Param.types'
import { AlgorithmResult, SimulationTimePoint } from './Result.types'
import { TimeSeries } from '../components/Main/Containment'
import {
         evolve,
         collectTotals,
         getPopulationParams,
         initializePopulation,
       } from "./model.js"

// NOTE: Assumes containment is sorted ascending in time.
function interpolate(containment: TimeSeries): (t: Date) => number {
    // If user hasn't touched containment, this vector is empty
    if (containment.length == 0) {
        return (t: Date) => {
            return 1.0;
        }
    }

    return (t: Date) => {
        const index = containment.findIndex(
            (d) => (Number(t) < Number(d.t))
        );

        // Deal with extrapolation
        // i.e. the time given exceeds the containment series.
        if (index <= 0) {
            return 1.0;
        }

        const deltaY = (containment[index].y - containment[index-1].y);
        const deltaT = (Number(containment[index].t) - Number(containment[index-1].t));

        const dS = deltaY / deltaT;
        const dT = Number(t) - Number(containment[index-1].t);
        return containment[index-1].y + (dS * dT);
    };
}

/**
 *
 * Entry point for the algorithm
 *
 */
export default async function run(
  params: AllParams,
  severity: SeverityTableRow[],
  ageDistribution: OneCountryAgeDistribution,
  containment: TimeSeries,
): Promise<AlgorithmResult> {
  console.log(JSON.stringify({ params }, null, 2));

  const modelParams  = getPopulationParams(params, severity, ageDistribution, interpolate(containment));
  const tMin: number = params.tMin.getTime()
  const initialCases = parseFloat(params.suspectedCasesToday);
  let initialState = initializePopulation(modelParams.populationServed, initialCases, tMin, ageDistribution);
  const tMax: number = params.tMax.getTime()
  const identity = function(x: number) {return x;}; // Use instead of samplePoisson for a deterministic
  const poisson = function(x: number) {return x>0?random.poisson(x)():0;}; // poisson sampling


  function simulate(initialState: SimulationTimePoint , func: (x: number) => number) {
      const dynamics = [initialState];
      while (dynamics[dynamics.length-1].time < tMax) {
        const pop = dynamics[dynamics.length-1];
        dynamics.push(evolve(pop, modelParams, func));
      }

      return collectTotals(dynamics);
  }

  const sim: AlgorithmResult = {
      "deterministicTrajectory": simulate(initialState, identity),
      "stochasticTrajectories": [],
      "params": modelParams
  };

  for (let i = 0; i < modelParams.numberStochasticRuns; i++) {
      initialState = initializePopulation(modelParams.populationServed, initialCases, tMin, ageDistribution);
      sim.stochasticTrajectories.push(simulate(initialState, poisson));
  }

  return sim
}

import random from 'random'
import { CountryAgeDistribution, OneCountryAgeDistribution } from '../assets/data/CountryAgeDistribution.types'
import { SeverityTableRow } from '../components/Main/SeverityTable'
import { AllParams } from './Param.types'
import { AlgorithmResult, SimulationTimePoint } from './Result.types'
import { populationAverageParameters, evolve, exportSimulation } from "./model.js"


/**
 *
 * Entry point for the algorithm
 *
 */
export default async function run(
  params: AllParams,
  severity: SeverityTableRow[],
  ageDistribution: OneCountryAgeDistribution,
): Promise<AlgorithmResult> {
  console.log(JSON.stringify({ params }, null, 2));
  // console.log(JSON.stringify({ severity }, null, 2))
  // console.log(JSON.stringify({ countryAgeDistribution }, null, 2))

  const modelParams = populationAverageParameters(params, severity, ageDistribution);
  const time = Date.now();
  const initialCases = parseFloat(params.suspectedCasesToday);
  const initialState = {"time" : time,
                        "susceptible" : modelParams.populationServed - initialCases,
                        "exposed" : 0,
                        "infectious" : initialCases,
                        "hospitalized" : 0,
                        "critical" : 0,
                        "discharged" : 0,
                        "recovered" : 0,
                        "dead" : 0};
  const tMax = new Date(params.tMax);
  const identity = function(x: number) {return x;}; // Use instead of samplePoisson for a deterministic
  const poisson = function(x: number) {return x>0?random.poisson(x)():0;}; // poisson sampling


  function simulate(initialState: SimulationTimePoint , func: (x: number) => number) {
      const dynamics = [initialState];
      while (dynamics[dynamics.length-1].time < tMax) {
        const pop = dynamics[dynamics.length-1];
        dynamics.push(evolve(pop, modelParams, func));
      }

      return dynamics;
  }

  const sim: AlgorithmResult = {
      "deterministicTrajectory": simulate(initialState, identity),
      "stochasticTrajectories": [],
      "params": modelParams
  };

  for (let i = 0; i < modelParams.numberStochasticRuns; i++) {
      sim.stochasticTrajectories.push(simulate(initialState, poisson));
  }

  return sim
}

import random from 'random'
import { CountryAgeDistribution } from '../assets/data/CountryAgeDistribution.types'
import { SeverityTableRow } from '../components/Main/SeverityTable'
import { AllParams } from './Param.types'
import { AlgorithmResult } from './Result.types'
import { populationAverageParameters, evolve, samplePoisson} from "./model.js"


/**
 *
 * Entry point for the algorithm
 *
 */
export default async function run(
  params: AllParams,
  severity: SeverityTableRow[],
  countryAgeDistribution: CountryAgeDistribution,
): Promise<AlgorithmResult> {
  console.log(JSON.stringify({ params }, null, 2));
  // console.log(JSON.stringify({ severity }, null, 2))
  // console.log(JSON.stringify({ countryAgeDistribution }, null, 2))

  const modelParams = populationAverageParameters(params, severity, countryAgeDistribution[params["ageDistribution"]]);
  const time = Date.now();
  const initialCases = parseFloat(params.suspectedCasesToday);
  const initialState = {"time" : time,
                        "susceptible" : modelParams.populationServed - initialCases,
                        "exposed" : 0,
                        "infectious" : initialCases,
                        "hospitalized" : 0,
                        "discharged" : 0,
                        "recovered" : 0,
                        "dead" : 0};
  console.log("A", initialState);
  const outbreakTrajectory = [initialState];
  const identity = function(x: Number) {return x;}; // Use instead of samplePoisson for a deterministic
  const poisson = function(x: Number) {return x>0?random.poisson(x)():0;}; // poisson sampling
  const poisson10 = function(x: Number) {return x>0?random.poisson(x/10)()*10:0;}; // poisson sampling

  const tMax = new Date(params.tMax);
  while (outbreakTrajectory[outbreakTrajectory.length-1].time < tMax){
    const prevState = outbreakTrajectory[outbreakTrajectory.length-1];
    outbreakTrajectory.push(evolve(prevState, modelParams, poisson10));
  }
  return {trajectory:outbreakTrajectory, params:modelParams};
}

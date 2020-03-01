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
  const tMax = new Date('2020-12-31');
  // console.log(JSON.stringify({ severity }, null, 2))
  // console.log(JSON.stringify({ countryAgeDistribution }, null, 2))

  // TODO: run the actual algorithm

  // DELETEME BEGIN: examples
  //
  // `mathjs` example:
  //
  // https://mathjs.org/docs/index.html
  //
  // const a = math.matrix([1, 4, 9, 16, 25])
  // const b = math.matrix(math.ones([2, 3]))
  // const d = [
  //   [1, 2],
  //   [3, 4],
  // ]
  // const e = math.matrix([
  //   [5, 6],
  //   [1, 1],
  // ])
  // const f = math.multiply(d, e)
  // console.log(math.format(b.size()))
  // console.log(math.format(f, 14))
  //
  //
  // `random` example
  //
  // https://www.npmjs.com/package/random
  //
  // random.float(0, 1)
  // random.int(0, 1)
  // random.boolean()
  // random.normal(0, 1)
  // random.bernoulli(0.5)
  //
  // DELETEME END

  // TODO: return the actual result
  //
  //

  // const N=1000000, incubationTime=5, recoveryRate = 0.2, hospitalizationRate = 0.05, R0=2.5;
  // const dischargeRate = 0.1, deathRate = 0.1;
  // const infectionRate = recoveryRate*R0;
  const modelParams = populationAverageParameters(params, severity, countryAgeDistribution[params["ageDistribution"]]);
  const time = Date.now();
  const initialState = {"time" : time,
                        "susceptible" : modelParams.populationServed-modelParams.suspectedCasesToday,
                        "exposed" : 0,
                        "infectious" : modelParams.suspectedCasesToday,
                        "hospitalized" : 0,
                        "recovered" : 0,
                        "dead" : 0};

  const outbreakTrajectory = [initialState];
  const identity = function(x: Number) {return x;}; // Use instead of samplePoisson for a deterministic
  // const poisson = function(x: Number) {return random.poisson(x);}; // poisson sampling

  while (outbreakTrajectory[outbreakTrajectory.length-1].time < tMax){
    const prevState = outbreakTrajectory[outbreakTrajectory.length-1];
    outbreakTrajectory.push(evolve(prevState, modelParams, identity));
  }

  return outbreakTrajectory;
}

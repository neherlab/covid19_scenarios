import * as math from 'mathjs'
import random from 'random'

import { CountryAgeDistribution } from '../assets/data/CountryAgeDistribution.types'
import { SeverityTableRow } from '../components/Main/SeverityTable'
import { AllParams } from './Param.types'
import { AlgorithmResult } from './Result.types'
import { populationAverageParameters } from "./model.js"

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
  const P = populationAverageParameters(severity, countryAgeDistribution[params["ageDistribution"]]);

  // const N=1000000, incubationTime=5, recoveryRate = 0.2, hospitalizationRate = 0.05, R0=2.5;
  // const dischargeRate = 0.1, deathRate = 0.1;
  // const infectionRate = recoveryRate*R0;
  const time = Date.now();
  const initialState = {"time":time, "susceptible":P.N-20, "exposed":10, "infectious":10,
                     "hospitalized":0,"recovered":0, "dead":0};
  const outbreakTrajectory = [initialState];
  const timeDeltaDays = 0.25
  const timeDelta = 1000*60*60*24*timeDeltaDays;
  for (let d=0; d<200; d++){
    const prevState = outbreakTrajectory[outbreakTrajectory.length-1];
    const newTime = prevState["time"] + timeDelta;
    const newCases = prevState['susceptible']*P.infectionRate*prevState['infectious']*timeDeltaDays/P.N;
    const newInfectious = prevState['exposed']*timeDeltaDays/P.incubationTime;
    const newRecovered = prevState['infectious']*timeDeltaDays*P.recoveryRate;
    const newHospitalized = prevState['infectious']*timeDeltaDays*P.hospitalizationRate;
    const newDischarged = prevState['hospitalized']*timeDeltaDays*P.dischargeRate;
    const newDead = prevState['hospitalized']*timeDeltaDays*P.deathRate;
    const newState = {"time":newTime,
                      "susceptible":prevState["susceptible"]-newCases,
                      "exposed":prevState["exposed"]-newInfectious+newCases,
                      "infectious":prevState["exposed"]-newInfectious+newCases,
                      "recovered":prevState["recovered"]+newRecovered+newDischarged,
                      "hospitalized":prevState["hospitalized"]+newHospitalized-newDischarged-newDead,
                      "dead":prevState["dead"]+newDead,
                    };
    outbreakTrajectory.push(newState);
  }
  console.log(outbreakTrajectory);
  return outbreakTrajectory;
}

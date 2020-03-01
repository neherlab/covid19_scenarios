import * as math from 'mathjs'
import random from 'random'

export function populationAverageParameters(params, severity, ageCounts) {
  var pop = {...params};
  console.log(ageCounts, params);
  pop.hospitalizationRate = 0;
  pop.recoveryRate = 0;
  pop.dischargeRate = 0;
  pop.deathRate = 0;
  pop.infectionRate = 0;
  pop.timeDeltaDays = 0.25;
  pop.timeDelta = 1000*60*60*24*pop.timeDeltaDays;

  // Compute age-stratified parameters
  var total = 0;
  severity.forEach(function(d) {total += ageCounts[d.ageGroup]});

  severity.forEach(function(d) {
      const freq = (1.0*ageCounts[d.ageGroup]/total);
      pop.hospitalizationRate += freq * d.hospitalized / 100;
      pop.deathRate += freq * d.fatal / 100;
      pop.recoveryRate += freq * d.mild / 100;
  });
  pop.recoveryRate /= pop.infectiousPeriod;
  pop.hospitalizationRate /= pop.infectiousPeriod;
  pop.dischargeRate = (1-pop.deathRate)/pop.lengthHospitalStay;
  pop.deathRate = pop.deathRate/pop.lengthHospitalStay;
  pop.infectionRate = pop.r0 * pop.recoveryRate;

  console.log(pop);

  return pop;
}

// Implementation of Knuth's algorithm
export function samplePoisson(lambda) {
    var L = math.exp(-lambda);
    var k = 0;
    var p = 1;
    do {
        k += 1;
        p *= math.random();
    } while (p > L);

    return k - 1;
}

// TODO: Allow a sampling function to be passed in as a parameter?
export function evolve(prevState, P, sample) {
    const newTime  = prevState["time"] + P.timeDelta;
    const newCases = sample(prevState['susceptible']*P.infectionRate*prevState['infectious']*P.timeDeltaDays/P.populationServed);
    const newInfectious = sample(prevState['exposed']*P.timeDeltaDays/P.incubationTime);
    const newRecovered  = sample(prevState['infectious']*P.timeDeltaDays*P.recoveryRate);
    const newHospitalized = sample(prevState['infectious']*P.timeDeltaDays*P.hospitalizationRate);
    const newDischarged   = sample(prevState['hospitalized']*P.timeDeltaDays*P.dischargeRate);
    const newDead  = sample(prevState['hospitalized']*P.timeDeltaDays*P.deathRate);
    const newState = {"time" : newTime,
                      "susceptible" : prevState["susceptible"]-newCases,
                      "exposed" : prevState["exposed"]-newInfectious+newCases,
                      "infectious" : prevState["exposed"]-newInfectious+newCases,
                      "recovered" : prevState["recovered"]+newRecovered+newDischarged,
                      "hospitalized" : prevState["hospitalized"]+newHospitalized-newDischarged-newDead,
                      "dead" : prevState["dead"]+newDead,
                    };
    return newState;
}

import * as math from 'mathjs'
import random from 'random'

export function populationAverageParameters(params, ageCounts) {
  var pop = {
      "N" : 1000000, 
      "R0" : 2.5,
      "incubationTime" : 5, 
      "recoveryRate" : 0, 
      "hospitalizationRate" : 0,
      "dischargeRate": 0,
      "deathRate" : 0,
      "infectionRate" : 0,
      "timeDeltaDays" : 0.25,
      "timeDelta" : 0 
  };
  pop.timeDelta = 1000*60*60*24*pop.timeDeltaDays;

  // Compute age-stratified parameters
  var total = 0; 
  params.forEach(function(d) {total += ageCounts[d.ageGroup]});

  params.forEach(function(d) {
      const freq = (1.0*ageCounts[d.ageGroup]/total);
      pop.hospitalizationRate += freq * d.hospitalized / 100; 
      pop.deathRate += freq * d.fatal / 100; 
      pop.recoveryRate += freq * d.mild / 100; 
  });
  pop.recoveryRate /= pop.incubationTime;
  pop.dischargeRate = pop.hospitalizationRate - pop.deathRate;
  pop.infectionRate = pop.R0 * pop.recoveryRate;

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
    const newCases = sample(prevState['susceptible']*P.infectionRate*prevState['infectious']*P.timeDeltaDays/P.N);
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

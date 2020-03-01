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
      "timeDelta" : 0
  };

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

export function evolve(prevState, P) {
    const newTime  = prevState["time"] + P.timeDelta;
    const newCases = prevState['susceptible']*P.infectionRate*prevState['infectious']*timeDeltaDays/P.N;
    const newInfectious = prevState['exposed']*timeDeltaDays/P.incubationTime;
    const newRecovered  = prevState['infectious']*timeDeltaDays*P.recoveryRate;
    const newHospitalized = prevState['infectious']*timeDeltaDays*P.hospitalizationRate;
    const newDischarged   = prevState['hospitalized']*timeDeltaDays*P.dischargeRate;
    const newDead  = prevState['hospitalized']*timeDeltaDays*P.deathRate;
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

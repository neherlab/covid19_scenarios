import infectionRate from './model.js'

const index = {"0-9": 0,
             "10-19": 1,
             "20-29": 2,
             "30-39": 3,
             "40-49": 4,
             "50-59": 5,
             "60-69": 6,
             "70-79": 7,
             "80+": 9};
                
export function populationParameters(params, severity) {
  var pop = {...params};
  pop.timeDeltaDays = 0.25;
  pop.timeDelta = msPerDay*pop.timeDeltaDays;
  pop.numberStochasticRuns = params.numberStochasticRuns
  
  pop.hospitalizedRate = new Float64Array(new ArrayBuffer(8*index.length));
  pop.recoveryRate = new Float64Array(new ArrayBuffer(8*index.length));
  pop.dischargeRate = new Float64Array(new ArrayBuffer(8*index.length));
  pop.deathRate = new Float64Array(new ArrayBuffer(8*index.length));

  severity.forEach(function(d) {
      I = index[d.ageGroup];
      pop.hospitalizedRate[I] = (d.severe / 100 * d.confirmed / 100);
      pop.recoveryRate[I] = 1 - pop.hospitalizedRate[I];
      pop.deathRate[I] = (d.fatal / 100);
      pop.dischargeRate[I] = 1 - pop.deathRate[I];
  });

  for (let i = 0; i < pop.hospitalizedRate.length; i++) {
      pop.hospitalizedRate[i] /= pop.infectiousPeriod;
      pop.recoveryRate[i] /= pop.infectiousPeriod;
      pop.deathRate[i] /= pop.lengthHospitalStay;
      pop.dischargeRate[i] /= pop.lengthHospitalStay;
  }

  return pop;
}

// NOTE: The data structure of the population is layed out as such:
// Pop = numberOfSubPopulations x numberOfAgeClasses matrix.
// Subpoulations are (in order):
// 0            1        2         3          4             5           6
// Susceptible, Exposed, Infected, Recovered, Hospitalized, Discharged, Dead
function newPopulation() {
    return new BigInt64Array(new ArrayBuffer(8 * index.length * 7));
}

// TODO: Implement super spreaders
// TODO: Implement imports (how to stratify by age?)
export function evolveAgent(pop, P, sample) {
    const at = (i, j) => j + index.length*i;

    const state = pop["state"];
    const newTime = pop["time"] + P.timeDelta;
    const newPop  = newPopulation();
    for (let i = 0; i < index.length; i++) {
        newPop[i] = state[i];
    }

    // Compute total infectious class
    let Itotal = 0; 
    for (let i = 0; i < index.length; i++) {
        Itotal += state[at(2, i)];
    }

    for (let i = 0; i < index.length; i++) {
        const dE = sample(infectionRate(newTime,P)*P.timeDeltaDays*state[at(0,i)]*Itotal/P.populationServed);
        const dI = sample(state[at(1, i)] * P.timeDeltaDays / P.incubationTime);
        const dH = sample(state[at(2, i)] * P.timeDeltaDays * P.hospitalizedRate[i]);
        const dR = sample(state[at(2, i)] * P.timeDeltaDays * P.recoveryRate[i]);
        const dF = sample(state[at(4, i)] * P.timeDeltaDays * P.deathRate[i]);
        const dD = sample(state[at(4, i)] * P.timeDeltaDays * P.dischargeRate[i]);

        newPop[at(0, i)] -= dE;
        newPop[at(1, i)] += dE - dI;
        newPop[at(2, i)] += dI - dH - dR;
        newPop[at(3, i)] += dR + dD;
        newPop[at(4, i)] += dH - dF - dD;
        newPop[at(5, i)] += dD;
        newPop[at(6, i)] += dF;
    }

    return {"state": newPop, "time": newTime};
}

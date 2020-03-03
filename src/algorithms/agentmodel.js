import * as math from 'mathjs'
import {infectionRate} from './model.js'

const index = {"0-9": 0,
             "10-19": 1,
             "20-29": 2,
             "30-39": 3,
             "40-49": 4,
             "50-59": 5,
             "60-69": 6,
             "70-79": 7,
             "80+": 8};
                
const msPerDay = 1000*60*60*24;

export function populationParameters(params, severity) {
  var pop = {...params};
  pop.timeDeltaDays = 0.25;
  pop.timeDelta = msPerDay*pop.timeDeltaDays;
  pop.numberStochasticRuns = params.numberStochasticRuns
  
  pop.hospitalizedRate = new Float64Array(new ArrayBuffer(8*Object.keys(index).length));
  pop.recoveryRate = new Float64Array(new ArrayBuffer(8*Object.keys(index).length));
  pop.dischargeRate = new Float64Array(new ArrayBuffer(8*Object.keys(index).length));
  pop.deathRate = new Float64Array(new ArrayBuffer(8*Object.keys(index).length));

  severity.forEach(function(d) {
      const I = index[d.ageGroup];
      console.log(d.ageGroup, I);
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

  pop.avgInfectionRate = pop.r0 / pop.infectiousPeriod;

  return pop;
}

// NOTE: The data structure of the population is layed out as such:
// Pop = numberOfSubPopulations x numberOfAgeClasses matrix.
// Subpoulations are (in order):
// 0            1        2         3          4             5           6
// Susceptible, Exposed, Infected, Recovered, Hospitalized, Discharged, Dead
function newPopulation() {
    return new Int32Array(new ArrayBuffer(8 * Object.keys(index).length * 7));
}

export function initialPopulation(ageDistribution, initialCases, N) {
    const at = (i, j) => j + Object.keys(index).length*i;
    const keys = ["0-9", "10-19", "20-29", "30-39", "40-49", "50-59", "60-69", "70-79", "80+"];

    const Z = Object.values(ageDistribution).reduce((a,b) => a + b);
    var sum = 0;
    var pop = newPopulation();
    for (let i = 0; i < Object.keys(index).length-1; i++) {
        pop[at(0, i)] = math.round((ageDistribution[keys[i]] / Z) * N);
        sum += pop[at(0, i)];
    }
    pop[at(0, Object.keys(index).length-1)] = N - sum;

    // Distribute the initial cases
    pop[at(0, 3)] -= initialCases;
    pop[at(2, 3)] += initialCases;

    return pop;
}

// TODO: Implement super spreaders
// TODO: Implement imports (how to stratify by age?)
export function evolveAgent(pop, P, sample) {
    const at = (i, j) => j + Object.keys(index).length*i;

    const state = pop["state"];
    const newTime = pop["time"] + P.timeDelta;

    var newPop  = newPopulation();
    newPop.set(state);

    // Compute total infectious class
    let Itotal = 0; 
    for (let i = 0; i < Object.keys(index).length; i++) {
        Itotal += state[at(2, i)];
    }

    // console.log("Itotal", Itotal);

    // console.log(P.hospitalizedRate);
    // console.log(P.recoveryRate);
    for (let i = 0; i < Object.keys(index).length; i++) {
        const dE = sample(infectionRate(newTime, P)*P.timeDeltaDays*state[at(0, i)]*Itotal/P.populationServed);
        const dI = sample(state[at(1, i)] * P.timeDeltaDays / P.incubationTime);
        const dH = sample(state[at(2, i)] * P.timeDeltaDays * P.hospitalizedRate[i]);
        const dR = sample(state[at(2, i)] * P.timeDeltaDays * P.recoveryRate[i]);
        const dF = sample(state[at(4, i)] * P.timeDeltaDays * P.deathRate[i]);
        const dD = sample(state[at(4, i)] * P.timeDeltaDays * P.dischargeRate[i]);

        // console.log("-->", "dE", dE, "dI", dI, "dH", dH, "dR", dR, "dF", dF, "dD", dD);
        // console.log("-->", "dI", dI, "dH", dH, "dR", dR);
        // console.log(state[at(2, i)]);

        newPop[at(0, i)] -= (dE);
        newPop[at(1, i)] += (dE - dI);
        newPop[at(2, i)] += (dI - dH - dR);
        newPop[at(3, i)] += (dR + dD);
        newPop[at(4, i)] += (dH - dF - dD);
        newPop[at(5, i)] += (dD);
        newPop[at(6, i)] += (dF);
    }

    return {"state": newPop, "time": newTime};
}

export function unpack(pop) {
    const at = (i, j) => j + Object.keys(index).length*i;

    var summed = {
        "time": pop["time"],
        "susceptible": 0,
        "exposed": 0,
        "infectious": 0,
        "recovered": 0,
        "hospitalized": 0,
        "discharged": 0,
        "dead": 0,
    }

    for (let i = 0; i < Object.keys(index).length; i++) {
        summed["susceptible"] += pop["state"][at(0, i)];
        summed["exposed"] += pop["state"][at(1, i)];
        summed["infectious"] += pop["state"][at(2, i)];
        summed["recovered"] += pop["state"][at(3, i)];
        summed["hospitalized"] += pop["state"][at(4, i)];
        summed["discharged"] += pop["state"][at(5, i)];
        summed["dead"] += pop["state"][at(6, i)];
    }

    return summed;
}

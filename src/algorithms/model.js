import * as math from 'mathjs'
import random from 'random'

const msPerDay = 1000*60*60*24;

const monthToDay = {
  Jan:0*30+15,
  Feb:1*30+15,
  Mar:2*30+15,
  Apr:3*30+15,
  May:4*30+15,
  Jun:5*30+15,
  Jul:6*30+15,
  Aug:7*30+15,
  Sep:8*30+15,
  Oct:9*30+15,
  Nov:10*30+15,
  Dec:11*30+15,
}

const jan2020 = new Date("2020-01-01");

export function infectionRate(time, params){
    //this is super hacky
    const phase = ((time-jan2020)/msPerDay/365-monthToDay[params.peakMonth]/365)*2*math.pi;
    return params.avgInfectionRate*(1+params.seasonalForcing*Math.cos(phase));
}


export function populationAverageParameters(params, severity, ageCounts) {
  var pop = {...params};
  console.log(ageCounts, params);
  pop.hospitalizedRate = 0;
  pop.recoveryRate = 0;
  pop.dischargeRate = 0;
  pop.deathRate = 0;
  pop.avgInfectionRate = 0;
  pop.timeDeltaDays = 0.25;
  pop.timeDelta = msPerDay*pop.timeDeltaDays;

  // Compute age-stratified parameters
  var total = 0;
  severity.forEach(function(d) {total += ageCounts[d.ageGroup];});
  pop.ageDistribution = {};
  severity.forEach(function(d) {
      const freq = (1.0*ageCounts[d.ageGroup]/total);
      pop.ageDistribution[d.ageGroup] = freq;
      pop.hospitalizedRate += freq * (d.severe + d.fatal) * d.confirmed / 100 / 100;
      pop.deathRate += freq * (d.fatal) / (d.fatal + d.severe);
      pop.recoveryRate += freq * ((d.mild / 100) + (1 - d.confirmed/100));
  });
  pop.recoveryRate /= pop.infectiousPeriod;
  pop.hospitalizedRate /= pop.infectiousPeriod;
  pop.dischargeRate = (1-pop.deathRate)/pop.lengthHospitalStay;
  pop.deathRate = pop.deathRate/pop.lengthHospitalStay;
  pop.avgInfectionRate = pop.r0 * pop.recoveryRate;

  console.log("POP", pop);

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
export function evolve(pop, P, sample) {
    const newTime  = pop["time"] + P.timeDelta;
    const newCases = sample((P.importsPerDay + infectionRate(newTime,P)*pop['susceptible']*pop['infectious']/P.populationServed)*P.timeDeltaDays);
    const newInfectious = sample(pop['exposed']*P.timeDeltaDays/P.incubationTime);
    const newRecovered  = sample(pop['infectious']*P.timeDeltaDays*P.recoveryRate);
    const newHospitalized = sample(pop['infectious']*P.timeDeltaDays*P.hospitalizedRate);
    const newDischarged   = sample(pop['hospitalized']*P.timeDeltaDays*P.dischargeRate);
    const newDead = sample(pop['hospitalized']*P.timeDeltaDays*P.deathRate);
    const newPop = {"time" : newTime,
                    "susceptible" : pop["susceptible"] - newCases,
                    "exposed" : pop["exposed"] - newInfectious + newCases,
                    "infectious" : pop["infectious"] + newInfectious - newRecovered - newHospitalized,
                    "recovered" : pop["recovered"] + newRecovered + newDischarged,
                    "hospitalized" : pop["hospitalized"] + newHospitalized - newDischarged - newDead,
                    "discharged" : pop["discharged"] + newDischarged,
                    "dead" : pop["dead"]+newDead,
                    };
    return newPop;
}

export function exportSimulation(trajectory) {

}

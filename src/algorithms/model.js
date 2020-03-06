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

export function infectionRate(time, avgInfectionRate, peakMonth, seasonalForcing){
    //this is super hacky
    const phase = ((time-jan2020)/msPerDay/365-monthToDay[peakMonth]/365)*2*math.pi;
    return avgInfectionRate*(1+seasonalForcing*Math.cos(phase));
}


export function populationAverageParameters(params, severity, ageCounts, containment) {
  var pop = {...params};

  pop.avgInfectionRate = 0;
  pop.timeDeltaDays = 0.25;
  pop.timeDelta = msPerDay*pop.timeDeltaDays;
  pop.numberStochasticRuns = params.numberStochasticRuns

  // Compute age-stratified parameters
  var total = 0;
  severity.forEach(function(d) {total += ageCounts[d.ageGroup];});

  pop.ageDistribution = {};
  pop.infectionSeverityRatio = {};
  pop.infectionFatality = {};

  var hospitalizedFrac = 0;
  var fatalFracHospitalized = 0;
  severity.forEach(function(d) {
      const freq = (1.0*ageCounts[d.ageGroup]/total);
      pop.ageDistribution[d.ageGroup] = freq;
      pop.infectionSeverityRatio[d.ageGroup] = (d.severe / 100) * (d.confirmed / 100);
      pop.infectionFatality[d.ageGroup] = (d.fatal / 100) * (d.severe / 100) * (d.confirmed / 100);
      hospitalizedFrac += freq * pop.infectionSeverityRatio[d.ageGroup];
      fatalFracHospitalized += freq * d.fatal / 100;
  });
  pop.recoveryRate = (1-hospitalizedFrac) / pop.infectiousPeriod;
  pop.hospitalizedRate = hospitalizedFrac / pop.infectiousPeriod;
  pop.dischargeRate = (1-fatalFracHospitalized) / pop.lengthHospitalStay;
  pop.deathRate = fatalFracHospitalized/pop.lengthHospitalStay;
  pop.avgInfectionRate = pop.r0 / pop.infectiousPeriod;
  pop.infectionRate = function(time) { return (1-containment(time)) * infectionRate(time, pop.avgInfectionRate, pop.peakMonth, pop.seasonalForcing); };

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

export function evolve(pop, P, sample) {
    const newTime  = pop["time"] + P.timeDelta;
    const newCases = sample(P.importsPerDay*P.timeDeltaDays) + sample(P.infectionRate(newTime)*pop['susceptible']*pop['infectious']/P.populationServed*P.timeDeltaDays);
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
    // Store parameter values
    
    // Down sample trajectory to once a day.
    // TODO: Make the down sampling interval a parameter

    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    function stringify(date) {
        const d = date.getDay();
        const m = date.getMonth();
        const y = date.getYear();

        return `${d} ${month[m]} ${y}`;
    }

    var csv = ["susceptible,exposed,infectious,recovered,hospitalized,discharged,dead"]; 
    var pop = {};
    trajectory.forEach(function(d) {
        const t = stringify(new Date(d.time));
        if (t in pop) { return; }
        pop[t] = true;
        csv.push(
            `${math.round(d.susceptible)},${math.round(d.exposed)},${math.round(d.infectious)},${math.round(d.recovered)},${math.round(d.hospitalized)},${math.round(d.discharged)},${math.round(d.dead)}`
        );
    });

    return csv.join('\n');
}

import * as math from 'mathjs'
import random from 'random'

const msPerDay = 1000*60*60*24;

const monthToDay = (m) => {return m*30+15;};

const jan2020 = new Date("2020-01-01");

export function infectionRate(time, avgInfectionRate, peakMonth, seasonalForcing){
    //this is super hacky
    const phase = ((time-jan2020)/msPerDay/365-monthToDay(peakMonth)/365)*2*math.pi;
    return avgInfectionRate*(1+seasonalForcing*Math.cos(phase));
}

export function getPopulationParams(params, severity, ageCounts, containment) {
  var pop = {...params};

  pop.timeDeltaDays = 0.25;
  pop.timeDelta = msPerDay*pop.timeDeltaDays;
  pop.numberStochasticRuns = params.numberStochasticRuns

  // Compute age-stratified parameters
  var total = 0;
  severity.forEach(function(d) {total += ageCounts[d.ageGroup];});

  pop.ageDistribution        = {};
  pop.infectionSeverityRatio = {};
  pop.infectionFatality      = {};
  pop.infectionCritical      = {};
  pop.recoveryRate           = {};
  pop.hospitalizedRate       = {};
  pop.dischargeRate          = {};
  pop.criticalRate           = {};
  pop.deathRate              = {};
  pop.stabilizationRate      = {};
  pop.isolatedFrac           = {};
  pop.importsPerDay          = {};
  pop.importsPerDay["total"] = params.importsPerDay;

  var hospitalizedFrac = 0;
  var criticalFracHospitalized = 0;
  var fatalFracCritical = 0;
  var avgIsolatedFrac = 0;
  severity.forEach(function(d) {
      const freq = (1.0*ageCounts[d.ageGroup]/total);
      pop.ageDistribution[d.ageGroup] = freq;
      pop.infectionSeverityRatio[d.ageGroup] = (d.severe / 100) * (d.confirmed / 100);
      pop.infectionCritical[d.ageGroup]      = pop.infectionSeverityRatio[d.ageGroup] * (d.critical / 100)
      pop.infectionFatality[d.ageGroup]      = pop.infectionCritical[d.ageGroup] * (d.fatal / 100)

      const dHospital = pop.infectionSeverityRatio[d.ageGroup];
      const dCritical = d.critical / 100;
      const dFatal    = d.fatal / 100;

      hospitalizedFrac         += freq * dHospital;
      criticalFracHospitalized += freq * dCritical;
      fatalFracCritical        += freq * dFatal;
      avgIsolatedFrac          += freq * d.isolated / 100;

      // Age specific rates
      pop.isolatedFrac[d.ageGroup]     = d.isolated / 100;
      pop.recoveryRate[d.ageGroup]     = (1-dHospital) / pop.infectiousPeriod;
      pop.hospitalizedRate[d.ageGroup] = (dHospital) / pop.infectiousPeriod;
      pop.dischargeRate[d.ageGroup]    = (1-dCritical) / pop.lengthHospitalStay;
      pop.criticalRate[d.ageGroup]     = (dCritical) / pop.lengthHospitalStay;
      pop.stabilizationRate[d.ageGroup] = (1-dFatal) / pop.lengthICUStay;
      pop.deathRate[d.ageGroup]        = (dFatal) / pop.lengthICUStay;
  });

  // Get import rates per age class (assume flat)
  const L = Object.keys(pop.recoveryRate).length;
  Object.keys(pop.recoveryRate).forEach((k) => { pop.importsPerDay[k] = params.importsPerDay/L });

  // Population average rates
  pop.recoveryRate["total"]      = (1-hospitalizedFrac) / pop.infectiousPeriod;
  pop.hospitalizedRate["total"]  = hospitalizedFrac / pop.infectiousPeriod;
  pop.dischargeRate["total"]     = (1-criticalFracHospitalized) / pop.lengthHospitalStay;
  pop.criticalRate["total"]      = criticalFracHospitalized / pop.lengthHospitalStay;
  pop.deathRate["total"]         = fatalFracCritical/pop.lengthICUStay;
  pop.stabilizationRate["total"] = (1-fatalFracCritical) / pop.lengthICUStay;
  pop.isolatedFrac["total"]      = avgIsolatedFrac;

  // Infectivity dynamics
  const avgInfectionRate = pop.r0 / pop.infectiousPeriod;
  pop.infectionRate = function(time) { return containment(time) * infectionRate(time, avgInfectionRate, pop.peakMonth, pop.seasonalForcing); };

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

export function initializePopulation(N, numCases, t0, ages) {
    if (ages == undefined) {
        const put = (x) => {return {"total": x};};
        return {
            "time" : t0,
            "susceptible" : put(N - numCases),
            "exposed" : put(0),
            "infectious" : put(numCases),
            "hospitalized" : put(0),
            "critical" : put(0),
            "discharged" : put(0),
            "recovered" : put(0),
            "dead" : put(0)
        };
    } else {
        const Z   = Object.values(ages).reduce((a,b) => a + b);
        const pop = {
            "time" : t0,
            "susceptible" : {},
            "exposed" : {},
            "infectious" : {},
            "hospitalized" : {},
            "critical" : {},
            "discharged" : {},
            "recovered" : {},
            "dead" : {}
        };
        // TODO: Ensure the sum is equal to N!
        Object.keys(ages).forEach((k, i) => {
            const n = math.round((ages[k] / Z) * N);
            pop.susceptible[k] = n;
            pop.exposed[k] = 0;
            pop.infectious[k] = 0;
            pop.hospitalized[k] = 0;
            pop.critical[k] = 0;
            pop.discharged[k] = 0;
            pop.recovered[k] = 0;
            pop.dead[k] = 0;
            if (i == math.round(Object.keys(ages).length/2)) {
                pop.susceptible[k] -= numCases;
                pop.infectious[k] = 0.3*numCases;
                pop.exposed[k] = 0.7*numCases;
            }
        });

        return pop;
    }
}

// NOTE: Assumes all subfields corresponding to populations have the same set of keys
export function evolve(pop, P, sample) {
    const fracInfected = Object.values(pop['infectious']).reduce((a, b) => a + b, 0)/P.populationServed;

    const newTime = pop["time"] + P.timeDelta;
    const newPop = {
                       "time" : newTime,
                       "susceptible" : {},
                       "exposed" : {},
                       "infectious" : {},
                       "recovered" : {},
                       "hospitalized" : {},
                       "critical" : {},
                       "discharged" : {},
                       "dead" : {},
                   };

    var push = (sub, age, delta) => {
        newPop[sub][age] = pop[sub][age] + delta;
    };

    Object.keys(pop['infectious']).forEach((age) => {
        const newCases        = sample(P.importsPerDay[age]*P.timeDeltaDays) +
                                sample((1-P.isolatedFrac[age])*P.infectionRate(newTime)*pop['susceptible'][age]*fracInfected*P.timeDeltaDays);
        const newInfectious   = sample(pop['exposed'][age]*P.timeDeltaDays/P.incubationTime);
        const newRecovered    = sample(pop['infectious'][age]*P.timeDeltaDays*P.recoveryRate[age]);
        const newHospitalized = sample(pop['infectious'][age]*P.timeDeltaDays*P.hospitalizedRate[age]);
        const newDischarged   = sample(pop['hospitalized'][age]*P.timeDeltaDays*P.dischargeRate[age]);
        const newCritical     = sample(pop['hospitalized'][age]*P.timeDeltaDays*P.criticalRate[age]);
        const newStabilized   = sample(pop['critical'][age]*P.timeDeltaDays*P.stabilizationRate[age]);
        const newDead         = sample(pop['critical'][age]*P.timeDeltaDays*P.deathRate[age]);

        push("susceptible", age, -newCases);
        push("exposed", age, newCases - newInfectious);
        push("infectious", age, newInfectious-newRecovered-newHospitalized);
        push("recovered", age, newRecovered+newDischarged);
        push("hospitalized", age, newHospitalized-newDischarged-newCritical);
        push("critical", age, newCritical-newStabilized-newDead);
        push("discharged", age, newDischarged);
        push("dead", age, newDead);
     });

    return newPop;
}

export function collectTotals(trajectory) {
    trajectory.forEach(function(d) {
        Object.keys(d).forEach(function(k) {
            if (k == "time" || "total" in d[k]) { return; }
            d[k]["total"] = Object.values(d[k]).reduce((a,b) => a + b);
        })
    });

    return trajectory;
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

    const header = Object.keys(trajectory[0]); //["susceptible,exposed,infectious,recovered,hospitalized,discharged,dead"];
    let csv = [header.join('\t')];

    const pop = {};
    trajectory.forEach(function(d) {
        const t = (new Date(d.time)).toISOString().substring(0,10);
        if (t in pop) { return; } //skip if date is already in table
        pop[t] = true;
        let buf = '';
        header.forEach((k) => {
            if (k == "time") {
                buf += `${t}`;
            } else {
                buf += `\t${math.round(d[k].total)}`;
            }
        });
        csv.push(buf);
    });

    return csv.join('\n');
}

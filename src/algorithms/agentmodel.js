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
// Susceptible, Exposed, Infected, Recovered, Hospitalized, Discharged, Dead
function newPopulation() {
    return new BigInt64Array(new ArrayBuffer(8 * index.length * 7));
}

export function evolveAgent(pop, param) {
    const at = (i, j) => j + index.length*i;

    const newTime = pop["time"] + param.timeDelta;
    let newPop = newPopulation();
}

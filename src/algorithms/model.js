export function populationAverageParameters(params, ageCounts) {
  var pop = {
      "N" : 1000000, 
      "R0" : 2.5,
      "incubationTime" : 5, 
      "recoveryRate" : 0, 
      "hospitalizationRate" : 0,
      "dischargeRate": 0,
      "deathRate" : 0,
      "infectionRate" : 0
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


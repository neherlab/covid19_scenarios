import * as math from 'mathjs'

const msPerDay = 1000 * 60 * 60 * 24

const monthToDay = m => {
  return m * 30 + 15
}

const jan2020 = new Date('2020-01-01')

export function infectionRate(time, avgInfectionRate, peakMonth, seasonalForcing) {
  // this is super hacky
  const phase = ((time - jan2020) / msPerDay / 365 - monthToDay(peakMonth) / 365) * 2 * math.pi
  return avgInfectionRate * (1 + seasonalForcing * Math.cos(phase))
}

export function getPopulationParams(params, severity, ageCounts, containment) {
  const pop = { ...params }

  pop.timeDeltaDays = 0.25
  pop.timeDelta = msPerDay * pop.timeDeltaDays
  pop.numberStochasticRuns = params.numberStochasticRuns

  // Compute age-stratified parameters
  const total = severity.map(d => d.ageGroup).reduce((a,b)=>a+ageCounts[b], 0);
  // TODO: Make this a form-adjustable factor
  pop.ageDistribution = {}
  pop.infectionSeverityRatio = {}
  pop.infectionFatality = {}
  pop.infectionCritical = {}
  pop.recoveryRate = {}
  pop.hospitalizedRate = {}
  pop.dischargeRate = {}
  pop.criticalRate = {}
  pop.deathRate = {}
  pop.overflowDeathRate = {}
  pop.stabilizationRate = {}
  pop.isolatedFrac = {}
  pop.importsPerDay = {}
  pop.importsPerDay.total = params.importsPerDay

  let hospitalizedFrac = 0
  let criticalFracHospitalized = 0
  let fatalFracCritical = 0
  let avgIsolatedFrac = 0
  severity.forEach(d => {
    const freq = (1.0 * ageCounts[d.ageGroup]) / total
    pop.ageDistribution[d.ageGroup] = freq
    pop.infectionSeverityRatio[d.ageGroup] = (d.severe / 100) * (d.confirmed / 100)
    pop.infectionCritical[d.ageGroup] = pop.infectionSeverityRatio[d.ageGroup] * (d.critical / 100)
    pop.infectionFatality[d.ageGroup] = pop.infectionCritical[d.ageGroup] * (d.fatal / 100)

    const dHospital = pop.infectionSeverityRatio[d.ageGroup]
    const dCritical = d.critical / 100
    const dFatal = d.fatal / 100

    hospitalizedFrac += freq * dHospital
    criticalFracHospitalized += freq * dCritical
    fatalFracCritical += freq * dFatal
    avgIsolatedFrac += (freq * d.isolated) / 100

    // Age specific rates
    pop.isolatedFrac[d.ageGroup] = d.isolated / 100
    pop.recoveryRate[d.ageGroup] = (1 - dHospital) / pop.infectiousPeriod
    pop.hospitalizedRate[d.ageGroup] = dHospital / pop.infectiousPeriod
    pop.dischargeRate[d.ageGroup] = (1 - dCritical) / pop.lengthHospitalStay
    pop.criticalRate[d.ageGroup] = dCritical / pop.lengthHospitalStay
    pop.stabilizationRate[d.ageGroup] = (1 - dFatal) / pop.lengthICUStay
    pop.deathRate[d.ageGroup] = dFatal / pop.lengthICUStay
    pop.overflowDeathRate[d.ageGroup] = pop.overflowSeverity*pop.deathRate[d.ageGroup];
  })

  // Get import rates per age class (assume flat)
  const L = Object.keys(pop.recoveryRate).length
  Object.keys(pop.recoveryRate).forEach(k => {
    pop.importsPerDay[k] = params.importsPerDay / L
  })

  // Population average rates
  pop.recoveryRate.total = (1 - hospitalizedFrac) / pop.infectiousPeriod
  pop.hospitalizedRate.total = hospitalizedFrac / pop.infectiousPeriod
  pop.dischargeRate.total = (1 - criticalFracHospitalized) / pop.lengthHospitalStay
  pop.criticalRate.total = criticalFracHospitalized / pop.lengthHospitalStay
  pop.deathRate.total = fatalFracCritical / pop.lengthICUStay
  pop.stabilizationRate.total = (1 - fatalFracCritical) / pop.lengthICUStay
  pop.overflowDeathRate.total = pop.overflowSeverity*fatalFracCritical / pop.lengthICUStay
  pop.isolatedFrac.total = avgIsolatedFrac

  // Infectivity dynamics
  const avgInfectionRate = pop.r0 / pop.infectiousPeriod
  pop.infectionRate = time =>
    containment(time) * infectionRate(time, avgInfectionRate, pop.peakMonth, pop.seasonalForcing)

  return pop
}

export function initializePopulation(N, numCases, t0, ages) {
  // FIXME: Why it can be `undefined`? Can it also be `null`?
  if (ages === undefined) {
    const put = x => {
      return { total: x }
    }
    return {
      time: t0,
      susceptible: put(N - numCases),
      exposed: put(0),
      infectious: put(numCases),
      hospitalized: put(0),
      critical: put(0),
      discharged: put(0),
      recovered: put(0),
      intensive: put(0),
      dead: put(0),
    }
  }
  const Z = Object.values(ages).reduce((a, b) => a + b)
  const pop = {
    time: t0,
    susceptible: {},
    exposed: {},
    infectious: {},
    hospitalized: {},
    critical: {},
    overflow: {},
    discharged: {},
    intensive: {},
    recovered: {},
    dead: {},
  }
  // TODO: Ensure the sum is equal to N!
  Object.keys(ages).forEach((k, i) => {
    const n = math.round((ages[k] / Z) * N)
    pop.susceptible[k] = n
    pop.exposed[k] = 0
    pop.infectious[k] = 0
    pop.hospitalized[k] = 0
    pop.critical[k] = 0
    pop.overflow[k] = 0
    pop.discharged[k] = 0
    pop.recovered[k] = 0
    pop.intensive[k] = 0
    pop.dead[k] = 0
    if (i === math.round(Object.keys(ages).length / 2)) {
      pop.susceptible[k] -= numCases
      pop.infectious[k] = 0.3 * numCases
      pop.exposed[k] = 0.7 * numCases
    }
  })

  return pop
}

// NOTE: Assumes all subfields corresponding to populations have the same set of keys
export function evolve(pop, P, sample) {
  const sum = (dict) => { return Object.values(dict).reduce((a, b) => a + b, 0); }
  const fracInfected = sum(pop.infectious) / P.populationServed

  const newTime = pop.time + P.timeDelta
  const newPop = {
    time: newTime,
    susceptible: {},
    exposed: {},
    infectious: {},
    recovered: {},
    hospitalized: {},
    critical: {},
    overflow: {},
    discharged: {},
    intensive: {},
    dead: {},
  }

  const push = (sub, age, delta) => {
    newPop[sub][age] = pop[sub][age] + delta
  }

  const newCases        = {};
  const newInfectious   = {};
  const newRecovered    = {};
  const newHospitalized = {};
  const newDischarged   = {};
  const newCritical     = {};
  const newStabilized   = {};
  const newICUDead      = {};
  const newOverflowStabilized = {};
  const newOverflowDead = {};

  // Compute all fluxes (apart from overflow states) barring no hospital bed constraints
  const Keys = Object.keys(pop.infectious).sort();
  Keys.forEach(age => {
    newCases[age] =
      sample(P.importsPerDay[age] * P.timeDeltaDays) +
      sample(
        (1 - P.isolatedFrac[age]) * P.infectionRate(newTime) * pop.susceptible[age] * fracInfected * P.timeDeltaDays,
      )
    newInfectious[age]         = Math.min(pop.exposed[age], sample(pop.exposed[age] * P.timeDeltaDays / P.incubationTime))
    newRecovered[age]          = Math.min(pop.infectious[age], sample(pop.infectious[age] * P.timeDeltaDays * P.recoveryRate[age]))
    newHospitalized[age]       = Math.min(pop.infectious[age] - newRecovered[age], sample(pop.infectious[age] * P.timeDeltaDays * P.hospitalizedRate[age]))
    newDischarged[age]         = Math.min(pop.hospitalized[age], sample(pop.hospitalized[age] * P.timeDeltaDays * P.dischargeRate[age]))
    newCritical[age]           = Math.min(pop.hospitalized[age] - newDischarged[age], sample(pop.hospitalized[age] * P.timeDeltaDays * P.criticalRate[age]))
    newStabilized[age]         = Math.min(pop.critical[age], sample(pop.critical[age] * P.timeDeltaDays * P.stabilizationRate[age]))
    newICUDead[age]            = Math.min(pop.critical[age] - newStabilized[age], sample(pop.critical[age] * P.timeDeltaDays * P.deathRate[age]))
    newOverflowStabilized[age] = Math.min(pop.overflow[age], sample(pop.overflow[age] * P.timeDeltaDays * P.stabilizationRate[age]))
    newOverflowDead[age]       = Math.min(pop.overflow[age] - newOverflowStabilized[age], sample(pop.overflow[age] * P.timeDeltaDays * P.overflowDeathRate[age]))

    push('susceptible', age, -newCases[age])
    push('exposed', age, newCases[age] - newInfectious[age])
    push('infectious', age, newInfectious[age] - newRecovered[age] - newHospitalized[age])
    push('hospitalized', age, newHospitalized[age] + newStabilized[age] + newOverflowStabilized[age] - newDischarged[age] - newCritical[age])
    // Cumulative categories
    push('recovered', age, newRecovered[age] + newDischarged[age])
    push('intensive', age, newCritical[age])
    push('discharged', age, newDischarged[age])
    push('dead', age, newICUDead[age] + newOverflowDead[age])
  })

  // Move hospitalized patients according to constrained resources
  let freeICUBeds = P.ICUBeds - (sum(pop.critical) - sum(newStabilized) - sum(newICUDead));
  Keys.forEach(age => {
      if (freeICUBeds > newCritical[age]) {
          freeICUBeds -= newCritical[age];
          push('critical', age, newCritical[age] - newStabilized[age] - newICUDead[age])
          push('overflow', age,  - newOverflowDead[age] - newOverflowStabilized[age])
      } else if (freeICUBeds > 0) {
          let newOverflow = newCritical[age] - freeICUBeds;
          push('critical', age, freeICUBeds - newStabilized[age] - newICUDead[age])
          push('overflow', age, newOverflow - newOverflowDead[age] - newOverflowStabilized[age])
          freeICUBeds = 0;
      } else {
          push('critical', age, -newStabilized[age] - newICUDead[age])
          push('overflow', age, newCritical[age] - newOverflowDead[age] - newOverflowStabilized[age])
      }
  });

  // If any overflow patients are left AND there are free beds, move them back.
  // Again, move w/ lower age as priority.
  for (let i = 0; freeICUBeds > 0 && i < Keys.length; i++) {
      const age = Keys[i];
      if (newPop.overflow[age] < freeICUBeds) {
          newPop.critical[age] += newPop.overflow[age];
          freeICUBeds -= newPop.overflow[age];
          newPop.overflow[age] = 0;
      } else {
          newPop.critical[age] += freeICUBeds;
          newPop.overflow[age] -= freeICUBeds;
          freeICUBeds = 0;
      }
  }

  // NOTE: For debug purposes only.
  /*
  const popSum = sum(newPop.susceptible) + sum(newPop.exposed) + sum(newPop.infectious) + sum(newPop.recovered) + sum(newPop.hospitalized) + sum(newPop.critical) + sum(newPop.overflow) + sum(newPop.dead);
  console.log(math.abs(popSum - P.populationServed));
  */

  return newPop
}

export function collectTotals(trajectory) {
  // FIXME: parameter reassign
  trajectory.forEach(d => {
    Object.keys(d).forEach(k => {
      if (k === 'time' || 'total' in d[k]) {
        return
      }
      d[k].total = Object.values(d[k]).reduce((a, b) => a + b)
    })
  })

  return trajectory
}

export function exportSimulation(trajectory) {
  // Store parameter values

  // Down sample trajectory to once a day.
  // TODO: Make the down sampling interval a parameter

  const header = Object.keys(trajectory[0])
  const csv = [header.join('\t')]

  const pop = {}
  trajectory.forEach(d => {
    const t = new Date(d.time).toISOString().slice(0, 10)
    if (t in pop) {
      return
    } // skip if date is already in table
    pop[t] = true
    let buf = ''
    header.forEach(k => {
      if (k === 'time') {
        buf += `${t}`
      } else {
        buf += `\t${math.round(d[k].total)}`
      }
    })
    csv.push(buf)
  })

  return csv.join('\n')
}

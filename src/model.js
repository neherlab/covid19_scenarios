import { config } from './config.js';

export function calculateDailyState(state, day) {
  let { susceptible, infected, recovered, vaccinated } = state;

  let newVaccinated = 0;
  if (day >= config.vaccination.startDate) {
    newVaccinated = Math.min(susceptible, config.vaccination.weeklyRate / 7);
    const effectiveVaccinated = newVaccinated * config.vaccination.efficiency;
    susceptible -= newVaccinated;
    vaccinated += newVaccinated;
    recovered += effectiveVaccinated;
  }

  const newInfections = (config.transmissionRate * susceptible * infected) / config.population;
  const newRecoveries = config.recoveryRate * infected;

  return {
    susceptible: Math.max(0, susceptible - newInfections),
    infected: Math.max(0, infected + newInfections - newRecoveries),
    recovered: recovered + newRecoveries,
    vaccinated: vaccinated
  };
}
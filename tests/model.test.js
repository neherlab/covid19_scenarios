import { calculateDailyState } from '../src/model.js';

test('should reduce susceptible population when vaccination starts', () => {
  const initialState = { susceptible: 100000, infected: 100, recovered: 0, vaccinated: 0 };
  const day = 31;
  const result = calculateDailyState(initialState, day);
  expect(result.vaccinated).toBeGreaterThan(0);
  expect(result.susceptible).toBeLessThan(100000);
});
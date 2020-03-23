export type OneCountryAgeDistribution = Record<string, number[]>

export interface CountryAgeDistribution {
  country: OneCountryAgeDistribution;
  bins: number[];
}

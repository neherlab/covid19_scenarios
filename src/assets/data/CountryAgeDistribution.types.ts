/* eslint-disable unicorn/escape-case */

export interface CountryAgeDistribution {
  country: Record<string, number[]>
  bins: number[]
}

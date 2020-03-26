export interface CaseCounts {
  time: string
  cases: number | null
  deaths: number | null
  hospitalized: number | null
  ICU: number | null
}

export type CaseCountsByCountry = Record<string, CaseCounts[]>

import { EmpiricalData, EmpiricalDatum } from './Param.types'
import { CaseCounts } from '../../assets/data/CaseCounts.types'

export function toEmpiricalDatum(input: CaseCounts): EmpiricalDatum {
  const toNumber = (val: number | null) => (val === null ? 0 : val)

  return {
    cases: toNumber(input.cases),
    hospitalized: toNumber(input.hospitalized),
    deaths: toNumber(input.deaths),
    ICU: toNumber(input.ICU),
    time: new Date(input.time),
  }
}

export function toEmpiricalData(input: CaseCounts[]): EmpiricalData {
  return input.map((datum) => toEmpiricalDatum(datum))
}

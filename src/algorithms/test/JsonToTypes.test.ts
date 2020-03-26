import { toEmpiricalData, toEmpiricalDatum } from '../types/JsonToTypes'
import { EmpiricalData, EmpiricalDatum } from '../types/Param.types'
import { CaseCounts, CaseCountsByCountry } from '../../assets/data/CaseCounts.types'
import caseCountData from '../../assets/data/case_counts.json'

describe('JsonToTypes', () => {
  // This test exists mainly for the linter to detect type errors.
  it('caseCount.json can be parsed into EmpiricalData type', () => {
    const testCountry = 'United States of America'
    const caseCountsByCountry: CaseCountsByCountry = caseCountData
    const caseCounts: CaseCounts[] = caseCountsByCountry[testCountry]
    const result: EmpiricalData = toEmpiricalData(caseCounts)
    expect(result).toHaveLength(caseCountData[testCountry].length)
  })

  it('toEmpiricalData converts CaseCount "time" field to Date type.', () => {
    const input: CaseCounts = {
      time: '2020-03-17',
      cases: 100,
      deaths: 0,
      hospitalized: 24,
      ICU: 4,
    }

    const result: EmpiricalDatum = toEmpiricalDatum(input)
    const expected = new Date('2020-03-17T00:00:00.000Z')

    expect(result.time).toStrictEqual(expected)
    expect(result.cases).toStrictEqual(100)
    expect(result.deaths).toStrictEqual(0)
    expect(result.hospitalized).toStrictEqual(24)
    expect(result.ICU).toStrictEqual(4)
  })

  it('toEmpiricalData converts CaseCount null values to 0', () => {
    const input: CaseCounts = {
      time: '2020-03-17',
      cases: 100,
      deaths: null,
      hospitalized: 24,
      ICU: 4,
    }

    const result: EmpiricalDatum = toEmpiricalDatum(input)

    expect(result.deaths).toStrictEqual(0)
  })
})

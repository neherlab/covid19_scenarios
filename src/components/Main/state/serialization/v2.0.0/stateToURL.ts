import type {
  AgeDistributionDatum,
  CaseCountsDatum,
  SeverityDistributionDatum,
  ScenarioDatum,
} from '../../../../../algorithms/types/Param.types'

export function stateToURL(
  scenarioData: ScenarioDatum,
  ageDistribution: AgeDistributionDatum[],
  severity: SeverityDistributionDatum[],
  caseCounts?: CaseCountsDatum[],
): string {
  // TODO: bring back the serialization
  return ''
}

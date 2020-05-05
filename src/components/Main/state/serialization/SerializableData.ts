import type {
  AgeDistributionDatum,
  ScenarioDatum,
  SeverityDistributionDatum,
} from '../../../../algorithms/types/Param.types'

export interface SerializableData {
  scenario: ScenarioDatum
  scenarioName: string
  ageDistribution: AgeDistributionDatum[]
  ageDistributionName: string
  severity: SeverityDistributionDatum[]
  severityName: string
}

import { Convert } from '../../../../../algorithms/types/Param.types'
import type { Shareable } from '../../../../../algorithms/types/Param.types'

import validateShareable, { errors } from '../../../../../.generated/validateShareable'

import { toExternal, toInternal } from '../../getScenario'

import type { SerializableData } from '../../serialize'

function serialize({
  scenario,
  scenarioName,
  ageDistribution,
  ageDistributionName,
  severity,
  severityName,
}: SerializableData): string {
  const shareable: Shareable = {
    schemaVer: '1.0.0',
    scenarioData: {
      name: scenarioName,
      data: toExternal(scenario),
    },
    ageDistributionData: {
      name: ageDistributionName,
      data: ageDistribution,
    },
    severityDistributionData: {
      name: severityName,
      data: severity,
    },
  }

  if (!validateShareable(shareable)) {
    throw errors
  }

  return Convert.shareableToJson(shareable)
}

function deserialize(input: string): SerializableData {
  const shareableDangerous = JSON.parse(input)

  if (!validateShareable(shareableDangerous)) {
    throw errors
  }

  const shareable = Convert.toShareable(JSON.stringify(shareableDangerous))
  const { scenarioData, ageDistributionData, severityDistributionData } = shareable

  return {
    scenario: toInternal(scenarioData.data),
    scenarioName: scenarioData.name,
    ageDistribution: ageDistributionData.data,
    ageDistributionName: ageDistributionData.name,
    severity: severityDistributionData.data,
    severityName: severityDistributionData.name,
  }
}

export default { serialize, deserialize }

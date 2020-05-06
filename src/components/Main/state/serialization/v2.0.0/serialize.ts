import { trim, isEqual } from 'lodash'

import Ajv from 'ajv'
import ajvLocalizers from 'ajv-i18n'

import { Convert } from '../../../../../algorithms/types/Param.types'
import type { Shareable } from '../../../../../algorithms/types/Param.types'

import validateShareable, { errors } from '../../../../../.generated/latest/validateShareable'

import { DeserializationErrorConversionFailed, DeserializationErrorValidationFailed } from '../errors'

import { toExternal, toInternal } from '../../getScenario'
import { SerializableData } from '../SerializableData'

const schemaVer = '2.0.0'

function serialize({
  scenario,
  scenarioName,
  ageDistribution,
  ageDistributionName,
  severity,
  severityName,
}: SerializableData): string {
  const shareable: Shareable = {
    schemaVer,
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

  const serialized = Convert.shareableToJson(shareable)

  if (process.env.NODE_ENV !== 'production' && !validateShareable(JSON.parse(serialized))) {
    throw errors
  }

  return serialized
}

function deserialize(input: string): SerializableData {
  const shareableDangerous = JSON.parse(input)

  if (!validateShareable(shareableDangerous)) {
    const locale = 'en' // TODO: use current locale
    const localize = ajvLocalizers[locale] ?? ajvLocalizers.en
    localize(errors)

    const ajv = Ajv({ allErrors: true })
    const separator = '<<<NEWLINE>>>'
    const errorString = ajv.errorsText(errors, { dataVar: '', separator })
    if (typeof errorString === 'string') {
      const errorStrings = errorString.split(separator).map(trim)
      if (errorStrings.length > 0) {
        throw new DeserializationErrorValidationFailed(errorStrings)
      }
    }

    throw new DeserializationErrorValidationFailed(['Unknown validation error'])
  }

  try {
    const shareable = Convert.toShareable(JSON.stringify(shareableDangerous))
    const { scenarioData, ageDistributionData, severityDistributionData } = shareable

    if (scenarioData.data.population.ageDistributionName !== ageDistributionData.name) {
      throw new DeserializationErrorValidationFailed([
        '/scenarioData/data/population/ageDistributionName should be equal to /ageDistributionData/name',
      ])
    }

    const ageDistributionCategories = ageDistributionData.data.map(({ ageGroup }) => ageGroup)
    const severityCategories = severityDistributionData.data.map(({ ageGroup }) => ageGroup)
    if (!isEqual(ageDistributionCategories, severityCategories)) {
      throw new DeserializationErrorValidationFailed([
        'arrays /ageDistributionData/data[] and /severityDistributionData/data[] should contain the same number of the same values for ageGroup',
      ])
    }

    return {
      scenario: toInternal(scenarioData.data),
      scenarioName: scenarioData.name,
      ageDistribution: ageDistributionData.data,
      ageDistributionName: ageDistributionData.name,
      severity: severityDistributionData.data,
      severityName: severityDistributionData.name,
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new DeserializationErrorConversionFailed(error.message)
    }

    throw new DeserializationErrorConversionFailed('Unknown conversion error')
  }
}

export default { [schemaVer]: { serialize, deserialize } }

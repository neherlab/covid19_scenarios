import { trim, isEqual } from 'lodash'

import Ajv from 'ajv'
import ajvLocalizers from 'ajv-i18n'

import validateShareable, { errors } from '../../../.generated/latest/validateShareable'

import type { ScenarioParameters, Shareable } from '../../../algorithms/types/Param.types'
import { Convert } from '../../../algorithms/types/Param.types'
import { toExternal, toInternal } from '../../../algorithms/types/convert'

import { DeserializationErrorConversionFailed, DeserializationErrorValidationFailed } from '../errors'

const schemaVer = '2.1.0'

function serialize(scenarioParameters: ScenarioParameters): string {
  const shareable: Shareable = {
    ...scenarioParameters,
    schemaVer,
    scenarioData: {
      ...scenarioParameters.scenarioData,
      data: toExternal(scenarioParameters.scenarioData.data),
    },
  }

  const serialized = Convert.shareableToJson(shareable)

  if (process.env.NODE_ENV !== 'production' && !validateShareable(JSON.parse(serialized))) {
    throw errors
  }

  return serialized
}

function validateSchema(shareableDangerous: Record<string, unknown>) {
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
}

function convert(shareableDangerous: Record<string, unknown>): Shareable {
  try {
    return Convert.toShareable(JSON.stringify(shareableDangerous))
  } catch (error) {
    if (error instanceof Error) {
      throw new DeserializationErrorConversionFailed(error.message)
    }

    throw new DeserializationErrorConversionFailed('Unknown conversion error')
  }
}

function validateMore(shareable: Shareable) {
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
}

function deserialize(input: string): ScenarioParameters {
  const shareableDangerous = JSON.parse(input) as Record<string, unknown>

  validateSchema(shareableDangerous)

  const shareable = convert(shareableDangerous)

  validateMore(shareable)

  const { scenarioData, ageDistributionData, severityDistributionData } = shareable

  return {
    scenarioData: {
      ...scenarioData,
      data: toInternal(scenarioData.data),
    },
    ageDistributionData,
    severityDistributionData,
  }
}

export default { [schemaVer]: { serialize, deserialize } }

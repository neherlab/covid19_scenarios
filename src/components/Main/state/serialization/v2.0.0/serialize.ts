import { trim } from 'lodash'

import Ajv from 'ajv'
import ajvLocalizers from 'ajv-i18n'

import { Convert } from '../../../../../algorithms/types/Param.types'
import type { Shareable } from '../../../../../algorithms/types/Param.types'

import validateShareable, { errors } from '../../../../../.generated/validateShareable'

import { toExternal, toInternal } from '../../getScenario'

import {
  SerializableData,
  DeserializationErrorValidationFailed,
  DeserializationErrorConversionFailed,
} from '../../serialize'

function serialize({
  scenario,
  scenarioName,
  ageDistribution,
  ageDistributionName,
  severity,
  severityName,
}: SerializableData): string {
  const shareable: Shareable = {
    schemaVer: '2.0.0',
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

export default { serialize, deserialize }

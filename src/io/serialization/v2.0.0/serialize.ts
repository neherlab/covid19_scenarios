/* eslint-disable camelcase */
import { trim } from 'lodash'

import Ajv from 'ajv'
import ajvLocalizers from 'ajv-i18n'

import validateShareable, { errors } from '../../../.generated/2.0.0/validateShareable'
import { Convert } from '../../../.generated/2.0.0/types'

import type { ScenarioParameters, Shareable } from '../../../algorithms/types/Param.types'

import { DeserializationErrorConversionFailed, DeserializationErrorValidationFailed } from '../errors'
import v2_1_0 from '../v2.1.0/serialize'

const schemaVer = '2.0.0' as const
const schemaVerNext = '2.1.0' as const

export function serialize(_0: ScenarioParameters): string {
  throw new Error(`: Developer error: This function should never be called.
  Serialization must always use the latest version of the serializer, but serializer of version "${schemaVer}" is called instead.
  Change the callee to use the latest version.`)
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

function convert(shareableDangerous: Record<string, unknown>) {
  try {
    return Convert.toShareable(JSON.stringify(shareableDangerous))
  } catch (error) {
    if (error instanceof Error) {
      throw new DeserializationErrorConversionFailed(error.message)
    }

    throw new DeserializationErrorConversionFailed('Unknown conversion error')
  }
}

function deserialize(input: string): ScenarioParameters {
  const shareableDangerous = JSON.parse(input) as Record<string, unknown>
  validateSchema(shareableDangerous)
  const shareable = convert(shareableDangerous)

  // Migrate object to schema v2.1.0:
  //  - Add palliative severities and set them to 0
  const shareableNew: Shareable = {
    ...shareable,
    schemaVer: schemaVerNext,
    severityDistributionData: {
      ...shareable.severityDistributionData,
      data: shareable.severityDistributionData.data.map((severity) => ({ ...severity, palliative: 0 })),
    },
  }

  // Delegate to the next version of deserializer
  return v2_1_0[schemaVerNext].deserialize(JSON.stringify(shareableNew))
}

export default { [schemaVer]: { serialize, deserialize } }

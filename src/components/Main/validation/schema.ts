import * as yup from 'yup'

import i18next from 'i18next'
import { AllParams } from '../../../.generated/types'

import { ageDistributionNames } from '../state/countryAgeDistributionData'
import { CUSTOM_COUNTRY_NAME } from '../state/state'

const ageRegions = [...ageDistributionNames, CUSTOM_COUNTRY_NAME]

const MSG_REQUIRED = i18next.t('Value is required')
const MSG_NON_NEGATIVE = i18next.t('Should be non-negative (or zero)')
const MSG_POSITIVE = i18next.t('Should be strictly positive (non-zero)')
const MSG_AT_LEAST_TEN = i18next.t('Should be at least ten')
const MSG_AT_LEAST_ONE_DAY = i18next.t('Should be at least one day or greater')
const MSG_INTEGER = i18next.t('Should be a whole number')
const MSG_MAX_100 = i18next.t('Should be 100 at most')
const MSG_TOO_MANY_RUNS = i18next.t('Too many runs')
const MSG_RANGE_INVALID = i18next.t('Range begin should be less or equal to range end')

// TODO: all this validation should be replaced with JSON-schema-based validation

export function dateRange() {
  return yup
    .object()
    .shape({
      tMin: yup.date().required(MSG_REQUIRED),
      tMax: yup.date().required(MSG_REQUIRED),
    })
    .test('valid date range', MSG_RANGE_INVALID, ({ tMin, tMax }) => tMin <= tMax)
}

export const schema: yup.Schema<AllParams> = yup.object().shape({
  population: yup.object().shape({
    populationServed: yup.number().required(MSG_REQUIRED).min(0, MSG_NON_NEGATIVE),

    country: yup.string().required(MSG_REQUIRED).oneOf(ageRegions, i18next.t('No such region in our data')),

    initialNumberOfCases: yup.number().required(MSG_REQUIRED).min(0, MSG_NON_NEGATIVE),

    importsPerDay: yup.number().required(MSG_REQUIRED).min(0, MSG_NON_NEGATIVE),

    cases: yup.string().required(MSG_REQUIRED),

    hospitalBeds: yup.number().required(MSG_REQUIRED).min(0, MSG_NON_NEGATIVE),

    ICUBeds: yup.number().required(MSG_REQUIRED).min(0, MSG_NON_NEGATIVE),
  }),

  epidemiological: yup.object().shape({
    latencyTime: yup.number().required(MSG_REQUIRED).min(1, MSG_AT_LEAST_ONE_DAY),

    infectiousPeriod: yup.number().required(MSG_REQUIRED).min(1, MSG_AT_LEAST_ONE_DAY),

    lengthHospitalStay: yup.number().required(MSG_REQUIRED).min(1, MSG_AT_LEAST_ONE_DAY),

    lengthICUStay: yup.number().required(MSG_REQUIRED).min(1, MSG_AT_LEAST_ONE_DAY),

    seasonalForcing: yup.number().required(MSG_REQUIRED).min(0, MSG_NON_NEGATIVE),

    overflowSeverity: yup.number().required(MSG_REQUIRED).positive(MSG_POSITIVE),

    peakMonth: yup.number().required(MSG_REQUIRED).min(0, MSG_POSITIVE).max(11),

    r0: yup
      .array()
      .of(yup.number().min(0, MSG_NON_NEGATIVE).required(MSG_REQUIRED))
      .min(2)
      .max(2)
      .required(MSG_REQUIRED)
      .test('valid numeric range', MSG_RANGE_INVALID, ([begin, end]) => begin <= end),
  }),

  containment: yup.object().shape({
    mitigationIntervals: yup.array().of(
      yup.object({
        color: yup.string().required(MSG_REQUIRED),
        id: yup.string().required(MSG_REQUIRED),
        mitigationValue: yup
          .array<number>()
          .of(yup.number().min(0, MSG_NON_NEGATIVE).max(100, MSG_MAX_100).required(MSG_REQUIRED))
          .min(2)
          .max(2)
          .required(MSG_REQUIRED)
          .test('valid percentage range', MSG_RANGE_INVALID, ([begin, end]) => begin <= end),

        name: yup.string().required(MSG_REQUIRED),
        timeRange: dateRange().required(MSG_REQUIRED),
      }),
    ),
  }),

  simulation: yup.object().shape({
    numberStochasticRuns: yup
      .number()
      .integer(MSG_INTEGER)
      .required(MSG_REQUIRED)
      .min(10, MSG_AT_LEAST_TEN)
      .max(100, MSG_TOO_MANY_RUNS),

    simulationTimeRange: dateRange().required(MSG_REQUIRED),
  }),
})

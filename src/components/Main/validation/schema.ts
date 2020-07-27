import * as yup from 'yup'

import i18next from 'i18next'
import { AgeGroup, SeverityDistributionDatum } from '../../../algorithms/types/Param.types'
import { UUIDv4 } from '../../../helpers/uuid'

import type { FormData } from '../Main'

import { CUSTOM_COUNTRY_NAME } from '../../../constants'

import { ageDistributionNames } from '../../../io/defaults/getAgeDistributionData'

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
const MSG_EXCEED_100 = i18next.t('Palliative and critical together exceed 100%')
// TODO: all this validation should be replaced with JSON-schema-based validation

const percentageSchema = yup
  .number()
  .required(i18next.t(MSG_REQUIRED))
  .min(0, i18next.t('Percentage should be non-negative'))
  .max(100, i18next.t('Percentage cannot be greater than 100'))
  .typeError(i18next.t('Percentage should be a number'))

const positiveIntegerSchema = yup
  .number()
  .required(i18next.t(MSG_REQUIRED))
  .integer(i18next.t('This value should be an integer'))
  .min(0, i18next.t('This value should be non-negative'))
  .typeError(i18next.t('This value should be an integer'))

export function numericRangeNonNegative() {
  return yup
    .object({
      begin: yup.number().required(MSG_REQUIRED).min(0, MSG_NON_NEGATIVE),
      end: yup.number().required(MSG_REQUIRED).min(0, MSG_NON_NEGATIVE),
    })
    .test('valid numeric range', MSG_RANGE_INVALID, ({ begin, end }) => begin <= end)
}

export function percentageRange() {
  return yup
    .object({
      begin: yup.number().required(MSG_REQUIRED).min(0, MSG_NON_NEGATIVE).max(100, MSG_MAX_100),
      end: yup.number().required(MSG_REQUIRED).max(100, MSG_MAX_100),
    })
    .test('valid percentage range', MSG_RANGE_INVALID, ({ begin, end }) => begin <= end)
}

export function dateRange() {
  return yup
    .object({
      begin: yup.date().required(MSG_REQUIRED),
      end: yup.date().required(MSG_REQUIRED),
    })
    .test('valid percentage range', MSG_RANGE_INVALID, ({ begin, end }) => begin <= end)
}

export const schema: yup.Schema<FormData> = yup
  .object()
  .shape({
    population: yup
      .object()
      .shape({
        populationServed: yup.number().required(MSG_REQUIRED).min(0, MSG_NON_NEGATIVE),

        ageDistributionName: yup
          .string()
          .required(MSG_REQUIRED)
          .oneOf(ageRegions, i18next.t('No such region in our data')),

        initialNumberOfCases: yup.number().required(MSG_REQUIRED).min(0, MSG_NON_NEGATIVE),

        importsPerDay: yup.number().required(MSG_REQUIRED).min(0, MSG_NON_NEGATIVE),

        caseCountsName: yup.string().required(MSG_REQUIRED),

        hospitalBeds: yup.number().required(MSG_REQUIRED).min(0, MSG_NON_NEGATIVE),

        icuBeds: yup.number().required(MSG_REQUIRED).min(0, MSG_NON_NEGATIVE),
      })
      .required(MSG_REQUIRED),

    epidemiological: yup
      .object()
      .shape({
        latencyDays: yup.number().required(MSG_REQUIRED).min(1, MSG_AT_LEAST_ONE_DAY),

        infectiousPeriodDays: yup.number().required(MSG_REQUIRED).min(1, MSG_AT_LEAST_ONE_DAY),

        hospitalStayDays: yup.number().required(MSG_REQUIRED).min(1, MSG_AT_LEAST_ONE_DAY),

        icuStayDays: yup.number().required(MSG_REQUIRED).min(1, MSG_AT_LEAST_ONE_DAY),

        seasonalForcing: yup.number().required(MSG_REQUIRED).min(0, MSG_NON_NEGATIVE),

        overflowSeverity: yup.number().required(MSG_REQUIRED).positive(MSG_POSITIVE),

        peakMonth: yup.number().required(MSG_REQUIRED).min(0, MSG_POSITIVE).max(11),

        r0: numericRangeNonNegative().required(MSG_REQUIRED),
      })
      .required(MSG_REQUIRED),

    mitigation: yup
      .object()
      .shape({
        mitigationIntervals: yup
          .array()
          .of(
            yup
              .object({
                color: yup.string().required(MSG_REQUIRED),
                id: (yup.string().required(MSG_REQUIRED) as unknown) as yup.Schema<UUIDv4>,
                transmissionReduction: percentageRange().required(MSG_REQUIRED),
                name: yup.string().required(MSG_REQUIRED),
                timeRange: dateRange().required(MSG_REQUIRED),
              })
              .required(MSG_REQUIRED),
          )
          .defined(),
      })
      .required(MSG_REQUIRED),

    simulation: yup
      .object()
      .shape({
        numberStochasticRuns: yup
          .number()
          .integer(MSG_INTEGER)
          .required(MSG_REQUIRED)
          .min(10, MSG_AT_LEAST_TEN)
          .max(100, MSG_TOO_MANY_RUNS),

        simulationTimeRange: dateRange().required(MSG_REQUIRED),
      })
      .required(MSG_REQUIRED),

    severity: yup
      .array()
      .of(
        yup
          .object()
          .shape({
            id: yup.string().required(MSG_REQUIRED),
            ageGroup: yup.string().oneOf(Object.values(AgeGroup)).required(MSG_REQUIRED),
            population: positiveIntegerSchema.required(MSG_REQUIRED),
            confirmed: percentageSchema.required(MSG_REQUIRED),
            severe: percentageSchema.required(MSG_REQUIRED),
            palliative: percentageSchema.required(MSG_REQUIRED),
            critical: percentageSchema.required(MSG_REQUIRED),
            fatal: percentageSchema.required(MSG_REQUIRED),
            isolated: percentageSchema.required(MSG_REQUIRED),
          })
          .required(MSG_REQUIRED)
          .test('max', MSG_EXCEED_100, ({ critical, palliative }: SeverityDistributionDatum) => {
            return critical + palliative <= 100
          }),
      )
      .defined(),
  })
  .required(MSG_REQUIRED)

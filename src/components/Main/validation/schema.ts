import * as yup from 'yup'

import i18next from 'i18next'

import { ageDistributionNames } from '../state/countryAgeDistributionData'
import { CUSTOM_COUNTRY_NAME } from '../state/state'

const ageRegions = [...ageDistributionNames, CUSTOM_COUNTRY_NAME]

const MSG_REQUIRED = i18next.t('Value is required')
const MSG_NON_NEGATIVE = i18next.t('Should be non-negative (or zero)')
const MSG_POSITIVE = i18next.t('Should be strictly positive (non-zero)')

export function dateRange() {
  return yup.object({
    tMin: yup.date().required(MSG_REQUIRED),
    tMax: yup.date().required(MSG_REQUIRED),
  })
}

export const schema = yup.object().shape({
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
    r0: yup.number().required(MSG_REQUIRED).min(0, MSG_NON_NEGATIVE),

    latencyTime: yup.number().required(MSG_REQUIRED).positive(MSG_POSITIVE),

    infectiousPeriod: yup.number().required(MSG_REQUIRED).positive(MSG_POSITIVE),

    lengthHospitalStay: yup.number().required(MSG_REQUIRED).positive(MSG_POSITIVE),

    lengthICUStay: yup.number().required(MSG_REQUIRED).positive(MSG_POSITIVE),

    seasonalForcing: yup.number().required(MSG_REQUIRED).min(0, MSG_NON_NEGATIVE),

    overflowSeverity: yup.number().required(MSG_REQUIRED).positive(MSG_POSITIVE),

    peakMonth: yup.number().required(MSG_REQUIRED).min(0, MSG_POSITIVE).max(11),
  }),

  containment: yup.object().shape({
    mitigationIntervals: yup.array().of(
      yup.object({
        color: yup.string().required(MSG_REQUIRED),
        id: yup.string().required(MSG_REQUIRED),
        mitigationValue: yup.number().min(0, MSG_NON_NEGATIVE).max(100).required(MSG_REQUIRED),
        name: yup.string().required(MSG_REQUIRED),
        timeRange: dateRange().required(MSG_REQUIRED),
      }),
    ),
  }),

  simulation: yup.object().shape({
    numberStochasticRuns: yup
      .number()
      .required(MSG_REQUIRED)
      .min(0, MSG_NON_NEGATIVE)
      .max(100, i18next.t('too many stochastic trajectories will slow things down')),

    simulationTimeRange: dateRange().required(MSG_REQUIRED),
  }),
})

import * as yup from 'yup'

import i18next from 'i18next'

import { ageDistributionNames } from '../state/countryAgeDistributionData'
import { CUSTOM_COUNTRY_NAME } from '../state/state'

const ageRegions = [...ageDistributionNames, CUSTOM_COUNTRY_NAME]

const MSG_REQUIRED = 'Required'
const MSG_NON_NEGATIVE = 'Should be non-negative'
const MSG_AT_LEAST_ONE_DAY = 'Should be at least one day (>=1)'

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

    latencyTime: yup.number().required(MSG_REQUIRED).min(1, MSG_AT_LEAST_ONE_DAY),

    infectiousPeriod: yup.number().required(MSG_REQUIRED).min(1, MSG_AT_LEAST_ONE_DAY),

    lengthHospitalStay: yup.number().required(MSG_REQUIRED).min(1, MSG_AT_LEAST_ONE_DAY),

    lengthICUStay: yup.number().required(MSG_REQUIRED).min(1, MSG_AT_LEAST_ONE_DAY),

    seasonalForcing: yup.number().required(MSG_REQUIRED).min(0, MSG_NON_NEGATIVE),

    overflowSeverity: yup.number().required(MSG_REQUIRED).min(0, MSG_NON_NEGATIVE),

    peakMonth: yup.number().required(MSG_REQUIRED).min(0, MSG_NON_NEGATIVE).max(11),
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

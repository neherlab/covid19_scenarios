import * as yup from 'yup'

import i18next from 'i18next'

import { ageDistributionNames } from '../state/countryAgeDistributionData'
import { CUSTOM_COUNTRY_NAME } from '../state/state'
import { DateRange } from '../../../.generated/types'

const countries = [...ageDistributionNames, CUSTOM_COUNTRY_NAME]

const MSG_REQUIRED = 'Required'
const MSG_NON_NEGATIVE = 'Should be non-negative'

export const schema = yup.object().shape({
  population: yup.object().shape({
    populationServed: yup.number().required(MSG_REQUIRED).min(0, MSG_NON_NEGATIVE),

    country: yup.string().required(MSG_REQUIRED).oneOf(countries, i18next.t('No such region in our data')),

    suspectedCasesToday: yup.number().required(MSG_REQUIRED).min(0, MSG_NON_NEGATIVE),

    importsPerDay: yup.number().required(MSG_REQUIRED).min(0, MSG_NON_NEGATIVE),

    cases: yup.string().required(MSG_REQUIRED).oneOf(countries, i18next.t('No such region in our data')),

    hospitalBeds: yup.number().required(MSG_REQUIRED).min(0, MSG_NON_NEGATIVE),

    ICUBeds: yup.number().required(MSG_REQUIRED).min(0, MSG_NON_NEGATIVE),
  }),

  epidemiological: yup.object().shape({
    r0: yup.number().required(MSG_REQUIRED).min(0, MSG_NON_NEGATIVE),

    latencyTime: yup.number().required(MSG_REQUIRED).min(0, MSG_NON_NEGATIVE),

    infectiousPeriod: yup.number().required(MSG_REQUIRED).min(0, MSG_NON_NEGATIVE),

    lengthHospitalStay: yup.number().required(MSG_REQUIRED).min(0, MSG_NON_NEGATIVE),

    lengthICUStay: yup.number().required(MSG_REQUIRED).min(0, MSG_NON_NEGATIVE),

    seasonalForcing: yup.number().required(MSG_REQUIRED).min(0, MSG_NON_NEGATIVE),

    overflowSeverity: yup.number().required(MSG_REQUIRED).min(0, MSG_NON_NEGATIVE),

    peakMonth: yup.number().required(MSG_REQUIRED).min(0, MSG_NON_NEGATIVE).max(11),
  }),

  containment: yup.object().shape({
    mitigationIntervals: yup.array().of(
      yup.object({
        color: yup.string().required(),
        id: yup.string().required(),
        mitigationValue: yup.number().min(0, MSG_NON_NEGATIVE).max(100).required(),
        name: yup.string().required(),
        timeRange: yup
          .object({
            tMin: yup.date().required(MSG_REQUIRED),
            tMax: yup.date().required(MSG_REQUIRED),
          })
          .required(),
      }),
    ),
  }),

  simulation: yup.object().shape({
    // numberStochasticRuns: yup
    //   .number()
    //   .required(MSG_REQUIRED)
    //   .min(0, MSG_NON_NEGATIVE)
    //   .max(100, i18next.t('too many stochastic trajectories will slow things down')),

    simulationTimeRange: yup
      .object({
        tMin: yup.date().required(MSG_REQUIRED),
        tMax: yup.date().required(MSG_REQUIRED),
      })
      .required(),
  }),
})

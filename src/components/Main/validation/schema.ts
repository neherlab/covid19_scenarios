import * as yup from 'yup'

import countryAgeDistribution from '../../../assets/data/country_age_distribution.json'

const countries = Object.keys(countryAgeDistribution)

const MSG_REQUIRED = 'Required'
const MSG_NON_NEGATIVE = 'Should be non-negative'

export const schema = yup.object().shape({
  population: yup.object().shape({
    populationServed: yup
      .number()
      .required(MSG_REQUIRED)
      .min(0, MSG_NON_NEGATIVE),

    country: yup
      .string()
      .required(MSG_REQUIRED)
      .oneOf(countries, 'No such country in our data'),

    suspectedCasesToday: yup
      .number()
      .required(MSG_REQUIRED)
      .min(0, MSG_NON_NEGATIVE),

    importsPerDay: yup.number().required(MSG_REQUIRED),
  }),

  epidemiological: yup.object().shape({
    r0: yup.number().required(MSG_REQUIRED),

    incubationTime: yup
      .number()
      .required(MSG_REQUIRED)
      .min(0, MSG_NON_NEGATIVE),

    infectiousPeriod: yup
      .number()
      .required(MSG_REQUIRED)
      .min(0, MSG_NON_NEGATIVE),

    lengthHospitalStay: yup
      .number()
      .required(MSG_REQUIRED)
      .min(0, MSG_NON_NEGATIVE),

    seasonalForcing: yup.number().required(MSG_REQUIRED),

    peakMonth: yup
      .number()
      .required(MSG_REQUIRED)
      .min(0, MSG_NON_NEGATIVE)
      .max(11),
  }),

  simulation: yup.object().shape({
    numberStochasticRuns: yup
      .number()
      // .required(MSG_REQUIRED)
      .min(0, MSG_NON_NEGATIVE)
      .max(100, 'too many stochastic trajectories will slow things down'),

    tMin: yup.date(),
    // .required(MSG_REQUIRED),

    tMax: yup.date(),
    // .required(MSG_REQUIRED),
  }),

  // serialInterval: yup.number().required(REQUIRED),

  // tMax: yup.string().required(REQUIRED),
})

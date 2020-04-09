import React from 'react'
import i18next from 'i18next'

import { FormikErrors, FormikTouched } from 'formik'

import { useTranslation } from 'react-i18next'

import { caseCountsNames } from '../state/caseCountsData'
import { ageDistributionNames } from '../state/countryAgeDistributionData'

import { CUSTOM_COUNTRY_NAME } from '../state/state'

import { CardWithoutDropdown } from '../../Form/CardWithoutDropdown'
import { FormDatePicker } from '../../Form/FormDatePicker'
import { FormDropdown } from '../../Form/FormDropdown'
import { FormNumericInput } from '../../Form/FormNumericInput'

const countryOptions = ageDistributionNames.map((country) => ({ value: country, label: country }))
countryOptions.push({ value: CUSTOM_COUNTRY_NAME, label: i18next.t(CUSTOM_COUNTRY_NAME) })

const caseCountOptions = caseCountsNames.map((country) => ({ value: country, label: country }))
caseCountOptions.push({ value: 'none', label: 'None' })

export interface ScenarioCardPopulationProps {
  errors?: FormikErrors<T>
  touched?: FormikTouched<T>
}

function ScenarioCardPopulation({ errors, touched }: ScenarioCardPopulationProps) {
  const { t } = useTranslation()
  // const populationScenarioOptions = stringsToOptions(scenarioState.population.scenarios)
  // function handleChangePopulationScenario(newPopulationScenario: string) {
  //   scenarioDispatch(setPopulationScenario({ scenarioName: newPopulationScenario }))
  // }

  return (
    <CardWithoutDropdown
      className="card--population"
      identifier="populationScenario"
      label={<h3 className="p-0 m-0 d-inline text-truncate">{t('Population')}</h3>}
      help={t('Parameters of the population in the health care system.')}
    >
      <FormNumericInput
        identifier="population.populationServed"
        label={t('Population')}
        help={t('Number of people served by health care system.')}
        step={1}
        precision={1}
        errors={errors}
        touched={touched}
      />
      <FormDropdown<string>
        identifier="population.country"
        label={t('Age distribution')}
        help={t('Country to determine the age distribution in the population')}
        options={countryOptions}
        errors={errors}
        touched={touched}
      />
      <FormNumericInput
        identifier="population.suspectedCasesToday"
        label={t('Initial number of cases')}
        help={t('Number of cases present at the start of simulation')}
        step={1}
        precision={1}
        errors={errors}
        touched={touched}
      />
      <FormNumericInput
        identifier="population.importsPerDay"
        label={t('Imports per day')}
        help={t('Number of cases imported from the outside per day on average')}
        step={0.1}
        precision={2}
        errors={errors}
        touched={touched}
      />
      <FormNumericInput
        identifier="population.hospitalBeds"
        label={`${t('Hospital Beds')} (${t('est.')})`}
        help={t(
          'Number of hospital beds available in health care system. Presets are rough estimates indicating total capacity. Number of beds available for COVID-19 treatment is likely much lower.',
        )}
        step={1}
        precision={1}
        errors={errors}
        touched={touched}
      />
      <FormNumericInput
        identifier="population.ICUBeds"
        label={`${t('ICU/ICMU')} (${t('est.')})`}
        help={t(
          'Number of ICU/ICMUs available in health care system. Presets are rough estimates indicating total capacity. Number of ICU/ICMUs available for COVID-19 treatment is likely much lower.',
        )}
        step={1}
        precision={1}
        errors={errors}
        touched={touched}
      />
      <FormDropdown<string>
        identifier="population.cases"
        label={t('Confirmed cases')}
        help={t('Select region for which to plot confirmed case and death counts.')}
        options={caseCountOptions}
        errors={errors}
        touched={touched}
      />
      <FormDatePicker
        identifier="simulation.simulationTimeRange"
        label={t('Simulation time range')}
        help={t(
          'Start and end date of the simulation. Changing the time range might affect the result due to resampling of the mitigation curve.',
        )}
      />
    </CardWithoutDropdown>
  )
}

export { ScenarioCardPopulation }

import React from 'react'

import { FormikErrors, FormikTouched } from 'formik'
import { AnyAction } from 'typescript-fsa'

import countryAgeDistribution from '../../../assets/data/country_age_distribution.json'
import countryCaseCounts from '../../../assets/data/case_counts.json'

import { CardWithDropdown } from '../../Form/CardWithDropdown'
import { FormDatePicker } from '../../Form/FormDatePicker'
import { FormDropdown } from '../../Form/FormDropdown'
import { stringsToOptions } from '../../Form/FormDropdownOption'
import { FormSpinBox } from '../../Form/FormSpinBox'

import { setPopulationScenario } from '../state/actions'

import { State } from '../state/state'

const countries = Object.keys(countryAgeDistribution)
const countryOptions = countries.map(country => ({ value: country, label: country }))
const caseCountOptions = Object.keys(countryCaseCounts).map(country => ({ value: country, label: country }))
caseCountOptions.push({value:'none', label:"None"})

export interface ScenarioCardPopulationProps {
  scenarioState: State
  errors?: FormikErrors<any>
  touched?: FormikTouched<any>
  scenarioDispatch(action: AnyAction): void
}

function ScenarioCardPopulation({ scenarioState, errors, touched, scenarioDispatch }: ScenarioCardPopulationProps) {
  const populationScenarioOptions = stringsToOptions(scenarioState.population.scenarios)
  function handleChangePopulationScenario(newPopulationScenario: string) {
    scenarioDispatch(setPopulationScenario({ scenarioName: newPopulationScenario }))
  }

  return (
    <CardWithDropdown
      identifier="populationScenario"
      label={<h5 className="p-0 m-0 d-inline text-truncate">Population</h5>}
      help="Parameters of the population in the health care system."
      options={populationScenarioOptions}
      value={populationScenarioOptions.find(s => s.label === scenarioState.population.current)}
      onValueChange={handleChangePopulationScenario}
    >
      <FormSpinBox
        identifier="population.populationServed"
        label="Population"
        help="Number of people served by health care system"
        step={1}
        errors={errors}
        touched={touched}
      />
      <FormDropdown<string>
        identifier="population.country"
        label="Age distribution"
        help="Country to determine the age distribution in the population"
        options={countryOptions}
        errors={errors}
        touched={touched}
      />
      <FormSpinBox
        identifier="population.suspectedCasesToday"
        label="Initial suspected cases"
        help="Number of cases present at the start of simulation"
        step={1}
        errors={errors}
        touched={touched}
      />
      <FormSpinBox
        identifier="population.importsPerDay"
        label="Imports per day"
        help="Number of cases imported from the outside per day on average"
        step={0.1}
        errors={errors}
        touched={touched}
      />
      <FormSpinBox
        identifier="population.hospitalBeds"
        label="Hospital Beds (est.)"
        help="Number of hospital beds available in health care system. Presets are rough estimates indicating total capacity. Number of beds available for COVID-19 treatment is likely much lower."
        step={1}
        errors={errors}
        touched={touched}
      />
      <FormSpinBox
        identifier="population.ICUBeds"
        label="ICU/ICMU (est.)"
        help="Number of ICU/ICMUs available in health care system. Presets are rough estimates indicating total capacity. Number of ICU/ICMUs available for COVID-19 treatment is likely much lower."
        step={1}
        errors={errors}
        touched={touched}
      />
      <FormDropdown<string>
        identifier="population.cases"
        label="Confirmed cases"
        help="Select region for which to plot confirmed case and death counts."
        options={caseCountOptions}
        errors={errors}
        touched={touched}
      />
      <FormDatePicker
        identifier="simulation.simulationTimeRange"
        label="Simulation time range"
        help="Start and end date of the simulation. Changing the time range might affect the result due to resampling of the mitigation curve."
      />
    </CardWithDropdown>
  )
}

export { ScenarioCardPopulation }

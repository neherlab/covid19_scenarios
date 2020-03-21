import React from 'react'

import moment from 'moment'

import { FormikErrors, FormikTouched } from 'formik'
import { AnyAction } from 'typescript-fsa'

import { CardWithDropdown } from '../../Form/CardWithDropdown'
import { FormDropdown } from '../../Form/FormDropdown'
import { stringsToOptions } from '../../Form/FormDropdownOption'
import { FormSpinBox } from '../../Form/FormSpinBox'

import { setEpidemiologicalScenario } from '../state/actions'
import { State } from '../state/state'

import { useTranslation } from 'react-i18next'

const months = moment.months()
const monthOptions = months.map((month, i) => ({ value: i, label: month }))

export interface ScenarioCardEpidemiologicalProps {
  scenarioState: State
  errors?: FormikErrors<any>
  touched?: FormikTouched<any>
  scenarioDispatch(action: AnyAction): void
}

function ScenarioCardEpidemiological({
  scenarioState,
  errors,
  touched,
  scenarioDispatch,
}: ScenarioCardEpidemiologicalProps) {
  const { t } = useTranslation()
  const epidemiologicalScenarioOptions = stringsToOptions(scenarioState.epidemiological.scenarios)
  function handleChangeEpidemiologicalScenario(newEpidemiologicalScenario: string) {
    scenarioDispatch(setEpidemiologicalScenario({ scenarioName: newEpidemiologicalScenario }))
  }

  return (
    <CardWithDropdown
      identifier="epidemiologicalScenario"
      label={<h5 className="p-0 d-inline text-truncate">{t('Epidemiology')}</h5>}
      help={t('Epidemiological-parameters-specifing-growth-rate')}
      options={epidemiologicalScenarioOptions}
      value={epidemiologicalScenarioOptions.find(s => s.label === scenarioState.epidemiological.current)}
      onValueChange={handleChangeEpidemiologicalScenario}
    >
      <FormSpinBox
        identifier="epidemiological.r0"
        label={`${t('Annual-average')} R\u2080`}
        help={t('Average-number-of-secondary-infections-per-case')}
        step={0.1}
        errors={errors}
        touched={touched}
      />
      <FormSpinBox
        identifier="epidemiological.incubationTime"
        label={`${t('Latency')} [${t('days')}]`}
        help={t('Time-from-infection-to-onset-of-symptoms-here-onset-of-infectiousness')}
        step={1}
        min={0}
        errors={errors}
        touched={touched}
      />
      <FormSpinBox
        identifier="epidemiological.infectiousPeriod"
        label={`${t('Infectious-period')} [${t('days')}]`}
        help={t('Average-number-of-days-a-person-is-infectious-together-with-the-incubation-time-this-defines-the-serial-interval')}
        step={1}
        min={0}
        errors={errors}
        touched={touched}
      />
      <FormSpinBox
        identifier="epidemiological.seasonalForcing"
        label={t('Seasonal-forcing')}
        help={t('Amplitude-of-seasonal-variation-in-transmission')}
        step={0.1}
        min={0}
        errors={errors}
        touched={touched}
      />
      <FormDropdown<number>
        identifier="epidemiological.peakMonth"
        label={t('Seasonal-peak')}
        help={t('Time-of-the-year-with-peak-transmission')}
        options={monthOptions}
        errors={errors}
        touched={touched}
      />
      <FormSpinBox
        identifier="epidemiological.lengthHospitalStay"
        label={`${t('Hospital-stay')} [${t('days')}]`}
        help={t('Average-number-of-days-a-severe-case-stays-in-regular-hospital-beds')}
        step={1}
        min={0}
        errors={errors}
        touched={touched}
      />
      <FormSpinBox
        identifier="epidemiological.lengthICUStay"
        label={`${t('Icu-stay')} [${t('days')}]`}
        help={t('Average-number-of-days-a-critical-case-stays-in-the-icu')}
        step={1}
        min={0}
        errors={errors}
        touched={touched}
      />
      <FormSpinBox
        identifier="epidemiological.overflowSeverity"
        label={t('Severity-of-icu-overflow')}
        help={t('A-multiplicative-factor-to-death-rate-to-patients-that-require-but-do-not-have-access-to-an-icu-bed-relative-to-those-who-do')}
        step={0.1}
        min={1}
        errors={errors}
        touched={touched}
      />
    </CardWithDropdown>
  )
}

export { ScenarioCardEpidemiological }

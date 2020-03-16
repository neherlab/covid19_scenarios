import React from 'react'

import moment from 'moment'

import { FormikErrors, FormikTouched } from 'formik'
import { ActionCreator } from 'typescript-fsa'
import { connect } from 'react-redux'

import { CardWithDropdown } from '../../Form/CardWithDropdown'
import { FormDropdown } from '../../Form/FormDropdown'
import { stringsToOptions } from '../../Form/FormDropdownOption'
import { FormSpinBox } from '../../Form/FormSpinBox'

import { setEpidemiologicalScenario, SetScenarioParams } from '../../../state/scenario/scenario.actions'
import { State } from '../../../state/reducer'
import {
  selectCurrentScenarioEpidemiological,
  selectScenariosEpidemiological,
} from '../../../state/scenario/scenario.selectors'

const months = moment.months()
const monthOptions = months.map((month, i) => ({ value: i, label: month }))

export interface ScenarioCardEpidemiologicalProps {
  errors?: FormikErrors<any>
  touched?: FormikTouched<any>
  epidemiologicalScenario: string
  epidemiologicalScenarios: string[]
  setEpidemiologicalScenario: ActionCreator<SetScenarioParams>
}

function ScenarioCardEpidemiological({
  errors,
  touched,
  epidemiologicalScenario,
  epidemiologicalScenarios,
  setEpidemiologicalScenario,
}: ScenarioCardEpidemiologicalProps) {
  const epidemiologicalScenarioOptions = stringsToOptions(epidemiologicalScenarios)
  function handleChangeEpidemiologicalScenario(newEpidemiologicalScenario: string) {
    setEpidemiologicalScenario({ scenarioName: newEpidemiologicalScenario })
  }

  return (
    <CardWithDropdown
      identifier="epidemiologicalScenario"
      label={<h5 className="p-0 d-inline text-truncate">{'Epidemiology'}</h5>}
      help="Epidemiological parameters specifing growth rate, seasonal variation, and duration of hospital stay. The presets are combinations of speed and geography (speed/region)."
      options={epidemiologicalScenarioOptions}
      value={epidemiologicalScenarioOptions.find(s => s.label === epidemiologicalScenario)}
      onValueChange={handleChangeEpidemiologicalScenario}
    >
      <FormSpinBox
        identifier="epidemiological.r0"
        label={'Annual average R\u2080'}
        help="Average number of secondary infections per case"
        step={0.1}
        errors={errors}
        touched={touched}
      />
      <FormSpinBox
        identifier="epidemiological.incubationTime"
        label="Latency [days]"
        help="Time from infection to onset of symptoms (here onset of infectiousness)"
        step={1}
        min={0}
        errors={errors}
        touched={touched}
      />
      <FormSpinBox
        identifier="epidemiological.infectiousPeriod"
        label="Infectious period [days]"
        help="Average number of days a person is infectious. Together with the incubation time, this defines the serial interval"
        step={1}
        min={0}
        errors={errors}
        touched={touched}
      />
      <FormSpinBox
        identifier="epidemiological.seasonalForcing"
        label="Seasonal forcing"
        help="Amplitude of seasonal variation in transmission"
        step={0.1}
        min={0}
        errors={errors}
        touched={touched}
      />
      <FormDropdown<number>
        identifier="epidemiological.peakMonth"
        label="Seasonal peak"
        help="Time of the year with peak transmission"
        options={monthOptions}
        errors={errors}
        touched={touched}
      />
      <FormSpinBox
        identifier="epidemiological.lengthHospitalStay"
        label="Hospital stay [days]"
        help="Average number of days a severe case stays in regular hospital beds"
        step={1}
        min={0}
        errors={errors}
        touched={touched}
      />
      <FormSpinBox
        identifier="epidemiological.lengthICUStay"
        label="ICU stay [days]"
        help="Average number of days a critical case stays in the ICU"
        step={1}
        min={0}
        errors={errors}
        touched={touched}
      />
    </CardWithDropdown>
  )
}

const mapStateToProps = (state: State) => ({
  epidemiologicalScenario: selectCurrentScenarioEpidemiological(state),
  epidemiologicalScenarios: selectScenariosEpidemiological(state),
})

const mapDispatchToProps = {
  setEpidemiologicalScenario,
}

export default connect(mapStateToProps, mapDispatchToProps)(ScenarioCardEpidemiological)

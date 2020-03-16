import React from 'react'

import { FormikErrors, FormikTouched } from 'formik'
import { connect } from 'react-redux'
import { ActionCreator } from 'typescript-fsa'

import { TimeSeries } from '../../../algorithms/TimeSeries'
import { ContainmentData } from '../../../algorithms/Param.types'

import { CardWithDropdown } from '../../Form/CardWithDropdown'
import { ContainmentGraph } from '../Containment/ContainmentGraph'

import { stringsToOptions } from '../../Form/FormDropdownOption'
import {
  setContainmentData,
  SetContainmentDataParams,
  setContainmentScenario,
  SetScenarioParams,
} from '../../../state/scenario/scenario.actions'
import { State } from '../../../state/reducer'
import {
  selectCurrentScenarioContainment,
  selectDataContainment,
  selectScenariosContainment,
} from '../../../state/scenario/scenario.selectors'

export interface ScenarioCardContainmentProps {
  errors?: FormikErrors<any>
  touched?: FormikTouched<any>
  containmentScenario: string
  containmentScenarios: string[]
  containmentData: ContainmentData
  setContainmentScenario: ActionCreator<SetScenarioParams>
  setContainmentData: ActionCreator<SetContainmentDataParams>
}

function ScenarioCardContainment({
  errors,
  touched,
  containmentScenario,
  containmentScenarios,
  containmentData,
  setContainmentScenario,
  setContainmentData,
}: ScenarioCardContainmentProps) {
  function handleChangeContainmentScenario(newContainmentScenario: string) {
    setContainmentScenario({ scenarioName: newContainmentScenario })
  }

  function handleChangeContainmentData(timeSeries: TimeSeries) {
    setContainmentData({ data: { reduction: timeSeries } })
  }

  const containmentScenarioOptions = stringsToOptions(containmentScenarios)

  return (
    <CardWithDropdown
      identifier="containmentScenario"
      label={<h5 className="p-0 d-inline text-truncate">Mitigation</h5>}
      help="Reduction of transmission through mitigation measures over time. Different presets with variable degree of reduction can be selected from the dropdown."
      options={containmentScenarioOptions}
      value={containmentScenarioOptions.find(s => s.label === containmentScenario)}
      onValueChange={handleChangeContainmentScenario}
    >
      <div className="w-auto">
        <ContainmentGraph data={containmentData.reduction} onDataChange={handleChangeContainmentData} />
      </div>
      <div>
        <p>
          Drag black dots with the mouse to simulate how infection control affects the outbreak trajectory. One is no
          infection control, zero is complete prevention of all transmission.
        </p>
      </div>
    </CardWithDropdown>
  )
}

const mapStateToProps = (state: State) => ({
  containmentScenario: selectCurrentScenarioContainment(state),
  containmentScenarios: selectScenariosContainment(state),
  containmentData: selectDataContainment(state),
})

const mapDispatchToProps = {
  setContainmentScenario,
  setContainmentData,
}

export default connect(mapStateToProps, mapDispatchToProps)(ScenarioCardContainment)

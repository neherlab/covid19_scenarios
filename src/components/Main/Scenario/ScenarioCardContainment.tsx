import React from 'react'

import { FormikErrors, FormikTouched } from 'formik'
import { AnyAction } from 'typescript-fsa'

import { TimeSeries } from '../../../algorithms/utils/TimeSeries'

import { CardWithDropdown } from '../../Form/CardWithDropdown'
import { FormSpinBox } from '../../Form/FormSpinBox'
import { ContainmentGraph } from '../Containment/ContainmentGraph'

import { stringsToOptions } from '../../Form/FormDropdownOption'
import { setContainmentData, setContainmentScenario } from '../state/actions'
import { State } from '../state/state'

export interface ScenarioCardContainmentProps {
  scenarioState: State
  errors?: FormikErrors<any>
  touched?: FormikTouched<any>
  scenarioDispatch(action: AnyAction): void
}

function ScenarioCardContainment({ scenarioState, errors, touched, scenarioDispatch }: ScenarioCardContainmentProps) {
  function handleChangeContainmentScenario(newContainmentScenario: string) {
    scenarioDispatch(setContainmentScenario({ scenarioName: newContainmentScenario }))
  }

  function handleChangeContainmentData(timeSeries: TimeSeries) {
    scenarioDispatch(setContainmentData({ data: { reduction:timeSeries, numberPoints: timeSeries.length } }))
  }

  const containmentScenarioOptions = stringsToOptions(scenarioState.containment.scenarios)

  const containmentData = scenarioState.containment.data.reduction

  return (
    <CardWithDropdown
      identifier="containmentScenario"
      label={<h5 className="p-0 d-inline text-truncate">Mitigation</h5>}
      help="Reduction of transmission through mitigation measures over time. Different presets with variable degree of reduction can be selected from the dropdown."
      options={containmentScenarioOptions}
      value={containmentScenarioOptions.find(s => s.label === scenarioState.containment.current)}
      onValueChange={handleChangeContainmentScenario}
    >
      <FormSpinBox
        identifier="containment.numberPoints"
        label="Number of points"
        help="Number of controllable points on the mitigation curve"
        step={1}
        min={2}
        errors={errors}
        touched={touched}
      />
      <div className="w-auto">
        <ContainmentGraph data={containmentData} onDataChange={handleChangeContainmentData} />
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

export { ScenarioCardContainment }

import React from 'react'

import { FormikErrors, FormikTouched } from 'formik'
import { AnyAction } from 'typescript-fsa'

import { CardWithDropdown } from '../../Form/CardWithDropdown'
import { FormSpinBox } from '../../Form/FormSpinBox'
import { ContainmentGraph } from '../Containment/ContainmentGraph'

import { stringsToOptions } from '../../Form/FormDropdownOption'
import { setContainmentData, setContainmentScenario } from '../state/actions'
import { State } from '../state/state'
import { TimeSeries } from '../../../algorithms/types/TimeSeries.types'

import { useTranslation } from 'react-i18next'

export interface ScenarioCardContainmentProps {
  scenarioState: State
  errors?: FormikErrors<any>
  touched?: FormikTouched<any>
  scenarioDispatch(action: AnyAction): void
}

function ScenarioCardContainment({ scenarioState, errors, touched, scenarioDispatch }: ScenarioCardContainmentProps) {
  const { t } = useTranslation()
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
      label={<h5 className="p-0 d-inline text-truncate">{t('Mitigation')}</h5>}
      help={t('reduction of transmission through mitigation measures over time different presets with variable degree of reduction can be selected from the dropdown')}
      options={containmentScenarioOptions}
      value={containmentScenarioOptions.find(s => s.label === scenarioState.containment.current)}
      onValueChange={handleChangeContainmentScenario}
    >
      <FormSpinBox
        identifier="containment.numberPoints"
        label={t('Number of points')}
        help={t('Number of controllable points on the mitigation curve')}
        step={1}
        min={2}
        max={100}
        errors={errors}
        touched={touched}
      />
      <div className="w-auto">
        <ContainmentGraph data={containmentData} onDataChange={handleChangeContainmentData} />
      </div>
      <div>
        <p>
          {t('Drag black dots with the mouse to simulate how infection control affects the outbreak trajectory')}
        </p>
      </div>
    </CardWithDropdown>
  )
}

export { ScenarioCardContainment }

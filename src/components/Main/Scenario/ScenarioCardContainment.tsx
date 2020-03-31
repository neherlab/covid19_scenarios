import React from 'react'

import { FormikErrors, FormikTouched } from 'formik'
import { AnyAction } from 'typescript-fsa'

import { useTranslation } from 'react-i18next'

import { CardWithoutDropdown } from '../../Form/CardWithoutDropdown'
import { FormSpinBox } from '../../Form/FormSpinBox'
import { ContainmentGraph } from '../Containment/ContainmentGraph'

import { setContainmentData } from '../state/actions'
import { State } from '../state/state'
import { TimeSeries } from '../../../algorithms/types/TimeSeries.types'

export interface ScenarioCardContainmentProps {
  scenarioState: State
  errors?: FormikErrors<any>
  touched?: FormikTouched<any>
  scenarioDispatch(action: AnyAction): void
}

function ScenarioCardContainment({ scenarioState, errors, touched, scenarioDispatch }: ScenarioCardContainmentProps) {
  const { t } = useTranslation()

  function handleChangeContainmentData(timeSeries: TimeSeries) {
    scenarioDispatch(setContainmentData({ data: { reduction: timeSeries, numberPoints: timeSeries.length } }))
  }

  const containmentData = scenarioState.data.containment.reduction

  return (
    <CardWithoutDropdown
      identifier="containmentScenario"
      label={<h3 className="p-0 d-inline text-truncate">{t('Mitigation')}</h3>}
      help={t('Reduction of transmission through mitigation measures over time. Different presets with variable degree of reduction can be selected from the dropdown.')}
      options={containmentScenarioOptions}
      value={containmentScenarioOptions.find((s) => s.label === scenarioState.containment.current)}
      onValueChange={handleChangeContainmentScenario}
    >
      <FormSpinBox
        identifier="containment.numberPoints"
        label={t('Number of points')}
        help={t('Number of controllable points on the mitigation curve')}
        step={1}
        min={5}
        max={100}
        errors={errors}
        touched={touched}
      />
      <div className="w-auto">
        <ContainmentGraph data={containmentData} onDataChange={handleChangeContainmentData} />
      </div>
      <div>
        <p>
          {t(
            'Drag black dots with the mouse to simulate how infection control affects the outbreak trajectory. One is no infection control, zero is complete prevention of all transmission.',
          )}
        </p>
      </div>
    </CardWithoutDropdown>
  )
}

export { ScenarioCardContainment }

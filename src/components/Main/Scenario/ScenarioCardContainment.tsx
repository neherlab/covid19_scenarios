import React from 'react'

import { FormikErrors, FormikTouched, FormikValues } from 'formik'

import { useTranslation } from 'react-i18next'

import { CardWithoutDropdown } from '../../Form/CardWithoutDropdown'
import { MitigationTable } from '../Mitigation/MitigationTable'

import { State } from '../state/state'
import { MitigationChart } from '../Mitigation/MitigationChart'

export interface ScenarioCardContainmentProps {
  scenarioState: State
  errors?: FormikErrors<FormikValues>
  touched?: FormikTouched<FormikValues>
}

function ScenarioCardContainment({ scenarioState, errors, touched }: ScenarioCardContainmentProps) {
  const { t } = useTranslation()

  const { mitigationIntervals } = scenarioState.data.containment

  return (
    <CardWithoutDropdown
      identifier="containmentScenario"
      label={<h5 className="p-0 d-inline text-truncate">{t('Mitigation')}</h5>}
      help={t(
        'Reduction of transmission through mitigation measures over time. Different presets with variable degree of reduction can be selected from the dropdown.',
      )}
    >
      <div className="w-auto">
        <MitigationTable mitigationIntervals={mitigationIntervals} />
      </div>
      <div className="w-auto">
        <MitigationChart />
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
